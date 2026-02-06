export const rentCheckExample = `name: RentCheck
description: Vuokranantajan työpöytäsovellus

flows:
  - screen: Kirjautuminen
    description: Sovelluksen aloitusnäkymä
    children:
      - action: Syötä sähköposti
        children:
          - condition: Onko validi sähköposti?
            description: IF/ELSE validointi
            children:
              - state: JOS validi
                children:
                  - action: Syötä salasana
                    children:
                      - action: Klikkaa Kirjaudu
                        children:
                          - condition: Tarkista kirjautuminen
                            children:
                              - state: JOS onnistui
                                children:
                                  - navigation: → Koti (Dashboard)
                              - state: MUUTEN virhe
                                children:
                                  - error: Väärä salasana
                                    description: Näytä virheviesti
                                    children:
                                      - action: Yritä uudelleen
                                        children:
                                          - navigation: ← takaisin
                          - condition: Nettiyhteys katkeaa
                            description: Verkkovirhe
                            children:
                              - error: Ei yhteyttä palvelimeen
                                children:
                                  - action: Yritä uudelleen
                                    children:
                                      - navigation: ← lataa sivu uudelleen
                                  - action: Offline-tila
                                    children:
                                      - screen: Offline-näkymä
                                        description: Rajoitetut toiminnot
              - state: MUUTEN virheellinen
                children:
                  - error: Virheellinen sähköpostiosoite
                    children:
                      - action: Korjaa syöte
                        children:
                          - navigation: ← takaisin kenttään

  - screen: Koti (Dashboard)
    description: Päänäkymä - kaikki asunnot listana
    children:
      - action: Klikkaa asuntoa
        description: Avaa asunnon tiedot
        children:
          - navigation: → Asunnon tiedot
            children:
              - action: Tab Yleistiedot
                children:
                  - screen: Yleistiedot-näkymä
                    description: Asunnon perustiedot
                    children:
                      - action: Muokkaa tietoja
                        children:
                          - navigation: → Muokkauslomake
                            children:
                              - action: Tallenna
                                children:
                                  - result: Tiedot päivitetty ✓
                              - action: Peruuta
                                children:
                                  - navigation: ← takaisin
              - action: Tab Välitys
                children:
                  - screen: Välitysnäkymä
                    description: Asunnon välitystoiminnot
                    children:
                      - action: Luo ilmoitus
                        children:
                          - navigation: → Ilmoituslomake
                            children:
                              - action: Täytä tiedot
                                children:
                                  - state: Kuvat lisätty?
                                    children:
                                      - action: Lisää kuvat
                                        children:
                                          - navigation: → Kuvagalleria
                                      - action: Jatka ilman
                              - action: Julkaise
                                children:
                                  - result: Ilmoitus julkaistu ✓
                              - action: Tallenna luonnos
                                children:
                                  - result: Luonnos tallennettu
                      - action: Näytä hakijat
                        children:
                          - navigation: → Hakijalista
                            children:
                              - action: Klikkaa hakijaa
                                children:
                                  - navigation: → Hakijan profiili
                                    children:
                                      - action: Kutsu näyttöön
                                        children:
                                          - navigation: → Näyttökalenteri
                                            children:
                                              - action: Valitse aika
                                                children:
                                                  - action: Lähetä kutsu
                                                    children:
                                                      - result: Kutsu lähetetty ✓
                                      - action: Hyväksy hakija
                                        children:
                                          - state: Varmistus
                                            children:
                                              - action: Vahvista
                                                children:
                                                  - navigation: → Sopimuslomake
                                                    children:
                                                      - action: Täytä sopimus
                                                        children:
                                                          - action: Lähetä allekirjoitettavaksi
                                                            children:
                                                              - result: Sopimus lähetetty ✓
                                              - action: Peruuta
                                                children:
                                                  - navigation: ← takaisin
                                      - action: Hylkää hakija
                                        children:
                                          - state: Syy?
                                            children:
                                              - action: Valitse syy
                                                children:
                                                  - action: Lähetä ilmoitus
                                                    children:
                                                      - result: Hakija hylätty
                      - action: Näytöt
                        children:
                          - navigation: → Näyttökalenteri
                            children:
                              - action: Luo uusi näyttö
                                children:
                                  - action: Valitse päivä
                                    children:
                                      - action: Valitse aika
                                        children:
                                          - action: Tallenna
                                            children:
                                              - result: Näyttö luotu ✓
                              - action: Muokkaa näyttöä
                                children:
                                  - action: Muuta aikaa
                                    children:
                                      - result: Aika muutettu
                                  - action: Peruuta näyttö
                                    children:
                                      - result: Näyttö peruttu
              - action: Tab Vuokralainen
                children:
                  - screen: Vuokralaisnäkymä
                    description: Nykyisen vuokralaisen tiedot
                    children:
                      - action: Lähetä viesti
                        children:
                          - navigation: → Chat
                            children:
                              - action: Kirjoita viesti
                                children:
                                  - action: Lähetä
                                    children:
                                      - result: Viesti lähetetty ✓
                      - action: Tilaa lahja
                        children:
                          - navigation: → Lahjakauppa
                            children:
                              - action: Valitse lahja
                                children:
                                  - action: Vahvista tilaus
                                    children:
                                      - result: Lahja tilattu ✓
                      - action: Näytä vuokrahistoria
                        children:
                          - navigation: → Maksuhistoria
                      - action: Päätä vuokrasuhde
                        children:
                          - state: Varmistus
                            children:
                              - action: Vahvista irtisanominen
                                children:
                                  - navigation: → Irtisanomislomake
                                    children:
                                      - action: Lähetä
                                        children:
                                          - result: Irtisanominen lähetetty
              - action: Tab Dokumentit
                children:
                  - screen: Dokumentit-näkymä
                    children:
                      - action: Lataa dokumentti
                        children:
                          - result: Dokumentti ladattu
                      - action: Lisää dokumentti
                        children:
                          - navigation: → Tiedostoselain
                            children:
                              - action: Valitse tiedosto
                                children:
                                  - result: Dokumentti lisätty ✓
      - action: Klikkaa Viestit
        children:
          - navigation: → Viestikeskus
            children:
              - screen: Viestit-näkymä
                description: Kaikki keskustelut
                children:
                  - action: Valitse keskustelu
                    children:
                      - navigation: → Chat
                        children:
                          - action: Kirjoita viesti
                            children:
                              - action: Lähetä
                                children:
                                  - result: Viesti lähetetty ✓
                          - action: Liitä tiedosto
                            children:
                              - action: Valitse tiedosto
                                children:
                                  - action: Lähetä
                                    children:
                                      - result: Tiedosto lähetetty ✓
                  - action: Uusi viesti
                    children:
                      - navigation: → Uusi keskustelu
                        children:
                          - action: Valitse vastaanottaja
                            children:
                              - action: Kirjoita viesti
                                children:
                                  - action: Lähetä
                                    children:
                                      - result: Keskustelu aloitettu ✓
      - action: Klikkaa Profiili
        children:
          - navigation: → Profiili
            children:
              - screen: Profiili-näkymä
                description: Omat asetukset
                children:
                  - action: Muokkaa tietoja
                    children:
                      - navigation: → Tietojen muokkaus
                        children:
                          - action: Tallenna
                            children:
                              - result: Tiedot päivitetty ✓
                  - action: Ilmoitusasetukset
                    children:
                      - navigation: → Ilmoitusasetukset
                        children:
                          - action: Muuta asetuksia
                            children:
                              - action: Tallenna
                                children:
                                  - result: Asetukset tallennettu ✓
                  - action: Kirjaudu ulos
                    children:
                      - state: Varmistus
                        children:
                          - action: Vahvista
                            children:
                              - navigation: → Kirjautumissivu
                          - action: Peruuta
                            children:
                              - navigation: ← takaisin
      - action: Klikkaa Lisää asunto
        children:
          - navigation: → Asunnon lisäys
            children:
              - screen: Lisäyslomake
                children:
                  - action: Täytä perustiedot
                    children:
                      - action: Lisää osoite
                        children:
                          - action: Lisää kuvat
                            children:
                              - action: Tallenna
                                children:
                                  - result: Asunto lisätty ✓
`;
