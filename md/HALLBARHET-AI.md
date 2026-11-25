# AI, datacenter och hållbarhet

Fristående underlag till föreläsningen. Kompletterar `HALLBARHET.md` (sidvikt och bilder).
Arbetsdokument: ändra, korta eller släng det du inte vill ha med.

Siffrorna nedan är hämtade 2026-11-24 och ändras snabbt. Skriv alltid "enligt IEA" och "enligt Google",
inte som absoluta fakta.

## 1. Datacenter och elförbrukning (IEA)

Källa: IEA, *Energy and AI*, publicerad 10 april 2025 (sammanfattningen).
https://www.iea.org/reports/energy-and-ai/executive-summary

- Datacenter stod för **ca 1,5 % av världens elförbrukning 2024, alltså 415 TWh**.
- Förbrukningen väntas **mer än dubblas till ca 945 TWh år 2030**, ungefär Japans totala elanvändning idag.
  Basfallet når ca 1 200 TWh år 2035 (spann 700-1 700 TWh).
- IEA skriver att AI är den viktigaste drivkraften bakom ökningen. Datacenter står ändå för bara ungefär
  **en tiondel av den globala ökningen av elbehovet** fram till 2030.
- Fördelning 2024: USA 45 %, Kina 25 %, Europa 15 %. USA står för den största delen av tillväxten.
- Elen väntas till ungefär hälften komma från förnybart. Gas (+175 TWh, främst USA) och kärnkraft växer också.
- Utsläpp från datacenters elanvändning väntas gå från 180 Mt till ca 300 Mt år 2035 (basfallet), men ligga
  under 1,5 % av energisektorns utsläpp. De är bland de snabbast växande källorna.
- Observera: sammanfattningen anger **ingen procentsats för hur stor del som är AI**. Hitta inte på en.

## 2. Vad en AI-fråga kostar (Google)

Källa: Google, *Measuring the environmental impact of delivering AI at Google Scale* (augusti 2025).
- Blogginlägg: https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference
- Teknisk rapport: https://arxiv.org/abs/2508.15734

- En **median Gemini-textfråga** uppges använda **0,24 Wh, 0,03 g CO2e och 0,26 mL vatten** (ca fem droppar).
  Google jämför med att titta på TV i 9 sekunder. Data från maj 2025.
- Mätningen omfattar aktiva acceleratorer, värdsystem, inaktiv kapacitet och datacenterns overhead.
  Räknar man bara aktiva acceleratorer blir siffran 0,10 Wh.
- Den **utesluter**: träning av modellen, externt nätverk, användarens enhet och datalagring.
- Google uppger att energin per fråga sjönk **33 gånger** och koldioxidavtrycket 44 gånger på ett år.

### Kritik och begränsningar (viktigt för källkritiken)
- Det är ett företags egen mätning av sin egen tjänst.
- Vattnet gäller bara kylning, inte vatten som används vid elproduktionen.
- Utsläppen är marknadsbaserade. Greenly uppskattar att platsbaserade utsläpp skulle ligga nära 0,09 g
  per fråga, alltså ca tre gånger högre.
- Frågornas längd och komplexitet anges inte. Rapporten gäller bara textfrågor, inte bild eller video.
- Läst via sökresultat och sammanfattningar, inte hela rapporten. Läs rapporten själv innan du citerar detaljer.

## 3. Saker att ta upp

1. **Skala.** En fråga är liten, men det är samma resonemang som van Kootens: miljarder frågor blir mycket.
2. **Vad siffran inte mäter.** Träning, hårdvarutillverkning, nätverk och användarens enhet ingår inte.
   Fråga studenterna: vad mäter en siffra, och vad lämnar den utanför?
3. **Effektivitet mot användning (rebound).** Varje fråga blir billigare, men antalet frågor växer.
   Samma tema som Pihkola-artikeln i `HALLBARHET.md`.
4. **Var elen kommer ifrån.** Förnybart, gas eller kärnkraft, och att USA står för 45 % av förbrukningen.
5. **Koppling till kursen.** Webshopen har en AI-chatt (kursens artikel om Azure OpenAI) och studenterna får använda
   AI som hjälplärare. Fråga: vad kostar vår chatt, och när behövs den?

## 4. Vad en utvecklare kan påverka

Mina egna allmänna råd, inte hämtade ur källorna ovan:

- Anropa inte AI-tjänsten för varje tangenttryck. Vänta tills användaren skickar.
- Begränsa svarslängden och håll prompten kort.
- Spara svar som går att återanvända i stället för att fråga igen.
- Använd en mindre modell när uppgiften är enkel.
- Fråga om AI verkligen behövs, eller om ett vanligt formulär eller en sökning räcker.

## 5. Diskussionsfrågor

- Är 0,24 Wh "mycket" eller "lite"? Vad saknar du för att kunna svara?
- Vem ska ta ansvar för AI:s energianvändning: företagen, utvecklarna eller användarna?
- Hur påverkas bedömningen av att siffrorna kommer från företaget som säljer tjänsten?
- Vad är skillnaden mellan att en fråga blir effektivare och att totalen minskar?

## 6. Att vara försiktig med

- Använd inte jämförelser av typen "en fråga motsvarar X" utan en källa för jämförelsen. TV-jämförelsen
  är Googles egen.
- Siffrorna är snabbt föränderliga. Kontrollera datum och källa innan du presenterar dem.

## Källor

- IEA, Energy and AI (sammanfattning): https://www.iea.org/reports/energy-and-ai/executive-summary
- IEA, Energy and AI (huvudsida): https://www.iea.org/reports/energy-and-ai
- Google, Measuring the environmental impact of AI inference:
  https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference
- Google, teknisk rapport (arXiv 2508.15734): https://arxiv.org/abs/2508.15734
- MIT Technology Review om Googles data: https://www.technologyreview.com/2025/08/21/1122288/google-gemini-ai-energy/
- DCD om Googles Gemini-siffror:
  https://www.datacenterdynamics.com/en/news/google-median-gemini-prompt-uses-024-watt-hours-of-power-and-consumes-026ml-of-water/
- Greenly, kommentar om Googles siffror:
  https://greenly.earth/en-us/leaf-media/data-stories/ai-efficiency-a-gemini-reality-check-with-greenly
