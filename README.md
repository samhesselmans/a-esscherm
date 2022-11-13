# a-esscherm
Informatie scherm voor de A-Eskwadraat kamer en boekverkoop. Acititeiten worden van de website ingeladen door de ical te downloaden en de eerstevolgende activiteiten te weergeven. 

## AMO / Uitgelichte posters
Het is ook mogelijk losse posters uit te lichten door ze in de map Posters te plaatsen. Deze bestanden kunnen in png, jpg, jpeg of gif formaat zijn. Van de posters in deze map wordt er 1 weer gegeven elke keer als alle activiteiten een keer zijn langsgekomen en wisselt door tot alle uitgelichte posters ook zijn behandeld.
Op het moment van schrijven staat het a-esscherm in de public html map van het televicie systeemaccount, hier kunnen dus de posters worden toegevoegd. 

## URL parameters
Verschillende instellingen van het a-esscherm kunnen worden aangepast met URL parameters. Hierbij heb je de volgende opties
```
aantalActs: het aantal weergegeven activiteiten
timePerAct: hoe lang een activiteit wordt weergegeven (in miliseconden)
actUpdateTime: om de hoeveel seconden nieuwe activiteiten worden opgehaald van de website
actsPerAmo: hoeveel activiteiten worden weergegeven voordat een amo poster wordt weergegeven (standaard is alle activiteiten 1 keer per amo poster)
localTest: voor het lokaal testen, hierbij wordt ics.ics ingeladen als test bestand
```
