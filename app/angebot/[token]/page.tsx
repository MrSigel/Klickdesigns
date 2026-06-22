import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getOfferByToken(token: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('offers')
    .select('*, customer:customers(name, email)')
    .eq('public_token', token)
    .single()
  return data
}

async function acceptOffer(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const token = formData.get('token') as string

  const { data: offer } = await supabase
    .from('offers')
    .select('id, accepted_at, converted_project_id')
    .eq('public_token', token)
    .single()

  if (!offer || offer.accepted_at) return

  const now = new Date().toISOString()

  await supabase
    .from('offers')
    .update({ accepted_at: now })
    .eq('public_token', token)

  // Create project from offer if not exists
  if (!offer.converted_project_id) {
    const { data: newProject } = await supabase
      .from('projects')
      .insert({
        title: `Projekt aus Angebot ${offer.id}`,
        status: 'open',
        description: 'Automatisch aus angenommenem Angebot erstellt.',
      })
      .select('id')
      .single()

    if (newProject) {
      await supabase.from('offers').update({ converted_project_id: newProject.id }).eq('public_token', token)
    }
  }

  revalidatePath(`/angebot/${token}`)
}

export default async function PublicOfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const offer = await getOfferByToken(token)

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="text-center">
          <h1 className="font-display text-2xl">Angebot nicht gefunden</h1>
          <p className="mt-2 text-anthracite/60">Der Link ist ungültig oder abgelaufen.</p>
        </div>
      </div>
    )
  }

  const isAccepted = !!offer.accepted_at

  return (
    <div className="min-h-screen bg-offwhite py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-anthracite/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-anthracite/30 bg-anthracite text-offwhite flex items-center justify-center text-sm font-semibold">K</div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Klickdesigns</h1>
          <p className="text-anthracite/60 text-sm">Ihr Angebot</p>
        </div>

        <div className="mb-6">
          <div className="text-sm text-anthracite/60">Angebotsnummer</div>
          <div className="font-mono text-xl font-semibold">{offer.offer_number}</div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-anthracite/60">Für</div>
          <div className="text-lg">{offer.customer?.name}</div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-anthracite/60">Titel</div>
          <div className="text-lg font-medium">{offer.title}</div>
        </div>

        <div className="border-t border-anthracite/10 pt-6 mt-6">
          <div className="text-2xl font-semibold tabular-nums">
            {(offer.total_cents / 100).toFixed(2)} {offer.currency}
          </div>
          {offer.valid_until && (
            <div className="text-sm text-anthracite/60 mt-1">gültig bis {new Date(offer.valid_until).toLocaleDateString('de-DE')}</div>
          )}
        </div>

        {offer.intro_text && (
          <div className="mt-6 text-sm text-anthracite/80 whitespace-pre-line">{offer.intro_text}</div>
        )}

        {isAccepted ? (
          <div className="mt-8 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 text-sm">
            Vielen Dank! Das Angebot wurde am {new Date(offer.accepted_at).toLocaleDateString('de-DE')} angenommen.
          </div>
        ) : (
          <form action={acceptOffer} className="mt-8">
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              className="w-full rounded-md bg-ruby py-3 text-offwhite font-semibold hover:bg-ruby/90"
            >
              Angebot annehmen
            </button>
            <p className="text-[11px] text-center text-anthracite/50 mt-3">Mit dem Klick bestätigen Sie die Annahme des Angebots.</p>
          </form>
        )}

        <div className="mt-10 text-[10px] text-anthracite/50 text-center">
          Klickdesigns · Gerther Straße 76 · 44577 Castrop-Rauxel
        </div>
      </div>
    </div>
  )
}
