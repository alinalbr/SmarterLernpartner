module.exports = {
    de: {
        translation: {
            POSITIVE_SOUND: `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>`,
            GREETING_SPEECHCON: `<say-as interpret-as="interjection">bravo</say-as>`,
            DOUBT_SPEECHCON: `<say-as interpret-as="interjection">hmm</say-as>`,
            ONBOARDING: `Hallo {{name}}, schön dass du dich dazu entschieden hast, mit mir deine Klausurenphase entspannt zu gestalten. Ich werde dir dabei helfen, deinen Lerntag zu planen und entspannter zu gestalten. Wenn du bereit bist, sage: Lerntag planen`,
            WELCOME_MSG: `Hallo {{name}}, schön dass du dich dazu entschieden hast, mit mir deinen heutigen Lerntag entspannt zu gestalten. Wie kann ich dir heute weiterhelfen? Wir können zum Beispiel deine Ziele für dein heutiges Fach und deine Lernzeit definieren, sage hierfür einfach: Lerntag konfigurieren, oder ich unterstütze dich einfach nur beim regelmäßigen Pausen einhalten, sage hierfür einfach: Erinner mich an Pausen.`, ////////////TODO: Alles was Skill kann hier rein
            WELCOME_BACK_MSG: 'Willkommen zurück {{name}}, was möchtest du machen? ',
            LEARNING_GOAL_MSG: '{{name}}, dein Lernziel für heute lautet {{learningTarget}} und du hast dir vorgenommen bis {{finishTime}} Uhr zu lernen. Was möchtest du tun? ',
            NEXT_STEP_AFTER_SUBJECT: 'Perfekt, dein heutiges Lernfach habe ich gespeichert. Jetzt interessiert mich noch was du am Ende unseres heutigen Lerntages in {{subject}} erreichen möchtest? Ein kleiner Tipp: Stecke deine Ziele nicht zu hoch, das kann zu Frustration führen. ',
            NEXT_STEP_AFTER_LEARNINGTARGET: 'Okay, dann machen wir weiter, bis wie viel Uhr möchtest du heute lernen? Setze dir bewusst ein Zeitlimit,  damit du kein schlechtes Gewissen hast, wenn du aufhörst zu lernen. ',
            NEXT_STEP_AFTER_FINISHTIME: 'Super, wenn du möchtest, werde ich dich an das Ende deines Lerntages um {{finishTime}} erinnern. Vorher möchte ich allerdings, dass du dir noch eine Belohnung für nach deinem Lerntag dir aussuchst, damit du dich darauf freuen kannst.',
            NEXT_STEP_AFTER_REWARD: '{{reward}} klingt nach einer tollen Belohnung! Dann kann es jetzt mit deinem Lerntag losgehen. Sage hierfür: Starte Lerntag.',
            REJECTED_MSG: 'Kein Problem. Sage dein Anliegen einfach noch mal, sodass ich es verstehen kann.',
            GREET_MSG: '$t(POSITIVE_SOUND) $t(GREETING_SPEECHCON) {{name}}. ',
            MISSING_MSG: `$t(DOUBT_SPEECHCON). Es sieht so aus, als hättest du mir noch nicht erzählt, was du heute lernen möchtest. `,
            POST_SAY_HELP_MSG: `Wenn du dein Lernziel verändern möchtest, sage Ich möchte heute zum Beispiel Mathe lernen. Oder du kannst deine Schluss-Zeit für heute ändern. Falls du Hilfe brauchst oder wissen möchtest was ich alles kann, frage einfach nach Hilfe. Also was möchtest du ausprobieren? `,
            HELP_MSG: `Ich kann dir dabei helfen
                       deinen Lerntag besser zu planen und dich an Pausen erinnern. Hierfür musst du allerdings zuerst dein heutiges Lernfach und weitere Informationen verraten. 
                       Um zu beginnen sage zum Beispiel: Plane meinen Lerntag. Ich kann dich aber auch unabhängig davon einfach nur an regelmäßige Pausen erinnern. 
                       Sage hierfür: Erinner mich an Pausen. 
                       Außerdem kannst du deinen Lernfortschritt in deinem Lernfach speichern. Sage hierfür einfach: Speichere Lernfortschritt.
                       Ich kann zudem auch Klausuren eintragen und dich daran erinnern, sage hierfür: Klausur eintragen und erinner mich an Klausur. 
                       Also, was möchtest du ausprobieren? `,
            REPROMPT_MSG: `Wenn du dir nicht sicher bist, was du als nächstes tun willst, frage nach Hilfe. Wenn du gehen möchtest, sage einfach Stopp. Was möchtest du als nächstes tun?`,
            GOODBYE_MSG: ['Tschüss {{name}}! ', 'Bis hoffentlich bald {{name}}! ', 'Wir sehen uns {{name}}! ', 'Hab eine schöne Zeit {{name}}! '],
            REFLECTOR_MSG: 'Du hast gerade {{intent}} angestoßen',
            FALLBACK_MSG: `Sorry, Ich kenne das nicht. Bitte versuche es noch mal. `,
            ERROR_MSG: 'Sorry, da gab es wohl einen Fehler. Bitte versuche es noch ein mal.',
            NO_TIMEZONE_MSG: `Ich kann deine Zeitzone nicht herausfinden. Bitte überprüfe deine Geräte Einstellungen und stelle sicher, dass eine Zeitzone ausgewählt wurde. Danach eröffne erneut diesen Skill und probiere es noch mal!`,
            REMINDER_CREATED_MSG: 'Ich werde dich von nun an an regelmäßige Pausen erinnern. Viel Spaß beim Lernen! ',
            REMINDER_ERROR_MSG: 'Sorry, da gab es wohl einen Fehler beim Strukturieren deines Lerntages. ',
            UNSUPPORTED_DEVICE_MSG: `Dieses Gerät untersützt diese Funktion wohl nicht. `,
            CANCEL_MSG: `Ok. Lass uns das rausnehmen. `,
            MISSING_PERMISSION_MSG: `Es sieht so aus als hättest du keine Berechtigung für Erinnerungen an Pausen. Ich habe dir schnell eine Anfrage an deine Alexa App geschickt, sodass du die Berechtigung aktivieren kannst. `,
            POST_REMINDER_HELP_MSG: `Super, dann geht es jetzt mit deinem Lerntag los. Wenn du an regelmäßige Pausen erinnert werden möchtest, sage bitte noch: Erinner mich an Pausen.`,
            GOOD_MOOD_OLD: 'Das freut mich, dass die letzten zwei Stunden so gut liefen. Dann ist es jetzt in deiner Pause besonders wichtig auf andere Gedanken zu kommen. Wenn du erst 2 Stunden lernst oder erst zwei Stunden vergangen sind, seitdem du eine lange Pause gemacht hast, empfehle ich dir eine kurze 30-minütige Pause zu machen. Sage hierfür: Starte kurze Pause. Falls du schon über 4 Stunden lernst mache lieber eine lange 60-minütige Pause Hierfür musst du: Starte lange Pause sagen. Ich erinnere dich dann daran wieder weiterzulernen. ',
            GOOD_MOOD: ['Das freut mich, dass deine letzte Phase so gut lief. Jetzt ist es wichtig, deine Pause gut zu nutzen und dich zu entspannen.', 'Sehr schön, dann solltest du jetzt deine Pause gut nutzen, um dich zu entspannen.', 'Das freut mich zu hören, dann ist es jetzt besonders wichtig in der Pause etwas abzuschalten.' ],
            RELAX: [' Wenn du soweit bist und in deiner Pause eine Entspannungsübung machen möchtest, sage: Starte Entspannungsübung'],
            FOOD: [' Mache dir einen leckeren Obststeller in deiner Pause', ' Wie wäre es mit einem kurzen und gesunden Rezept? Sage hierfür einfach: Gebe Rezeptidee', ' Denk daran, ausreichend zu trinken! Vielleicht nutzt du jetzt die Pause und holst die ausreichend Trinken.', ' Mache dir doch einen Tee in der Pause.' ],
            MEDITATION: [' Meditationen können helfen, den Stress auf Dauer zu reduzieren. Probiere es in deiner Pause doch mal mit einer kurzen geführten Meditation. Sage hierfür einfach: Starte Meditation'],
            CONCENTRATION: [' Eine kleine Konzentrationsübung kann dir helfen, dich wieder besser konzentrieren zu können, probiere doch mal eine aus. Sage hierfür: Starte Konzentrationsübung'],
            ACTIVATION: [' Probiere doch mal eine Aktivierungsübung aus bevor du in die Pause startest. Sage hierfür: Starte Aktivierungsübung'],
            
            OKAY_MOOD: 'Mach dir keine Gedanken, deine Pause ist jetzt besonders wichtig, um noch mal Motivation zu tanken',
            BAD_MOOD: 'Es ist okay, mal eine nicht so gute Phase zu haben. Vielleicht ist es gerade nicht die optimale Tageszeit für eine anspruchsvolle Lernphase. Deshalb ist eine Pause auch gerade sehr wichtig.  ',
            //Exercises
            RELAX_EXERCISE: ` <audio src="https://s3.amazonaws.com/ask-soundlibrary/nature/amzn_sfx_ocean_wave_surf_01.mp3" /> <voice name="Vicki">  <prosody rate="slow"> Schließe die Augen und folge meinen Worten. <break time="1s"/> Ich lege mich auf den Rücken, drehe die Hände leicht nach oben, wie ein Mensch, der alle Ruhe empfangen kann. <break time="1s"/>

                                Ich lasse alles los und gehe jetzt mit meinen Ge- danken in die Füße und entspanne mich.<break time="1s"/>
                                
                                Ich bewege die Zehen. <break time="1s"/>
                                
                                Ich stelle mir vor,
                                
                                dass die Entspannung wie ein warmes, goldenes, heilendes Licht durch die Fußsohlen in mich hineintritt und die Füße ganz ausfüllt <break time="1s"/>
                                
                                Die Füße sind jetzt oder gleich entspannt. <break time="2s"/>
                                
                                Die Entspannung steigt höher <break time="1s"/>
                                
                                über die Fußgelenke, <break time="1s"/>
                                
                                füllt die Unterschenkel mit ihrem warmen,
                                
                                goldenen Leuchten ganz aus, <break time="2s"/>
                                
                                steigt über die Knie, <break time="1s"/>
                                
                                füllt die Oberschenkel. <break time="2s"/>
                                
                                Füße und Beine sind ganz leicht und entspannt. <break time="1s"/>
                                
                                Die Entspannung tritt in den Bauchraum, <break time="1s"/>
                                
                                füllt alle Knochen, sämtliche Organe, jegliches Gewebe.
                                
                                Füllt ihn ganz aus.
                                
                                Ich bin völlig gelöst. <break time="2s"/>
                                
                                Langsam sickert das warme, heilende, goldene Licht der Entspannung durch das Zwerchfell in den Oberkörper. <break time="2s"/>
                                
                                Füllt ihn bis zum Schultergürtel ganz mit seinem Leuchten aus. <break time="1s"/>
                                
                                Das Herz schlägt ruhig und gleichmäßig <break time="1s"/>
                                
                                Der Atem geht leicht und fließend. <break time="1s"/>
                                
                                Ich gehe jetzt mit meinem Bewusstsein in die Fingerspitzen und bewege sie ein wenig. <break time="1s"/>
                                
                                Ich stelle mir vor, dass die Entspannung wie ein goldenes Leuchten in die geöffneten Hände strömt. <break time="1s"/>
                                
                                Die Hände sind entspannt. <break time="1s"/>
                                
                                Die Entspannung steigt über die Handgelenke in die Unterarme, <break time="1s"/>
                                
                                über die Ellbogen in die Oberarme. <break time="1s"/>
                                
                                Hände und Arme sind ganz entspannt. <break time="1s"/>
                                
                                Die Entspannung der Hände und Arme vereinigt sich mit der Entspannung des Körpers im Schulterbereich. 
                                
                                Die Entspannung strömt jetzt intensiver in mich hinein, gleichzeitig durch die Hände und die Füße,
                                
                                steigt in Hals und Nacken, füllt sie ganz.
                                
                                Der Kopf ist gefüllt und entspannt sich:
                                
                                Das Kinn ist leicht zur Brust geneigt 
                                
                                der Mund leicht geöffnet 
                                
                                die Zunge liegt locker im Mund 
                                
                                und ich kann lächeln.
                                
                                Ich atme ruhig und fließend durch die Nase ein und aus. 
                                
                                Der Atem ist leicht wie ein Wattebausch. 
                                
                                Die Augenpartie ist gelöst, 
                                
                                die Stirn entspannt 
                                
                                und die Entspannung sinkt tiefer und tiefer in mich hinein. 
                                
                                Das Gehirn wird von dem warmen, leuchtenden Licht bis in die letzten Windungen durchdrungen und kann sich ganz entspannen.
                                
                                Alles, was ich auf mich geladen habe, kann ich loslassen: 
                                
                                die Verspannungen und Anspannungen, 
                                
                                das, was mich schwer macht. 
                                
                                Ich spüre, wie aus der Tiefe meiner Seele
                                eine tiefen Ruhe,
                                
                                eine große Gelassenheit
                                
                                und eine allumfassenden Heiterkeit
                                
                                aufsteigt, mich ganz durchdringt. 
                                
                                Ich genieße diese Ruhe,
                                
                                den Frieden
                                
                                und die Heiterkeit
                                
                                in mir. 
                                
                                Und jetzt tauche ich aus meiner Tiefe auf.

                                Der Atem wird intensiver.
                                
                                Das Herz schlägt kräftig und gleichmäßig.
                                
                                Vorsichtig bewege ich die Finger, die Hände,
                                
                                die Füße,
                                
                                öffne die Augen,
                                
                                reibe die Hände, als ob ich mich wasche,
                                
                                dehne und strecke mich –
                                
                                wachse von einer Wand zur anderen,
                                
                                kuschele mich in meine Unterlage ein --
                                
                                bin wieder ganz hier.
                                
                                <break time="4s"/>
                                <audio src="https://s3.amazonaws.com/ask-soundlibrary/nature/amzn_sfx_ocean_wave_surf_01.mp3" />
                                </prosody> </voice>`,
                                
            MEDITATION_EXERCISE: `  <audio src="https://s3.amazonaws.com/ask-soundlibrary/nature/amzn_sfx_ocean_wave_surf_01.mp3" /> <voice name="Vicki">  <prosody rate="slow">
                                Stelle dir vor, du kannst in deinen eigenen Körper gehen und ihn durchwandern.

                                Ganz klein bist du und tritts durch die linke Fußsohle in dich selbst hinein. <break time="2s"/>
                                
                                Zuerst ist dir alles fremd. <break time="2s"/>
                                
                                Aber dann entdeckst du Blutbahnen und lässt dich treiben: 
                                
                                durch den Fuß, an den Knöcheln vorbei in den Unterschenkel, über das Knie in den Oberschenkel. <break time="2s"/>
                                
                                Und jetzt erreichst du den Unterleib. <break time="2s"/>
                                
                                Er ist wie eine riesige Fabrik, in der die Lebensstoffe, Hormone für deinen Körper, für dein Leben hergestellt werden. <break time="2s"/>
                                
                                Schau dich um:
                                
                                Die Nieren und Nebennieren, <break time="2s"/>
                                
                                die Geschlechtsorgane, <break time="2s"/>
                                
                                der Darm,
                                
                                das Sonnengeflecht als großes Nervenzentrum.
                                
                                Du lässt dich weiter treiben, <break time="2s"/>
                                
                                der Magen ist da,
                                
                                die Leber, die Lunge, das Herz.
                                
                                Du atmest ruhig und gleichmäßig
                                
                                und dein Körper wird mit herrlichem, frischen Sauerstoff versorgt. <break time="2s"/>
                                
                                Das Herz schlägt ruhig und gleichmäßig.
                                
                                Höher und höher steigst du, über den Hals in den Kopf.
                                
                                Du schaust dir deinen Mund an, die Nase, die Ohren, die Augen,
                                
                                die riesige Scheune, die das Gehirn ist mit all dem Wissen, das du angehäuft hast. --
                                
                                Und jetzt willst du umkehren.
                                
                                Du nimmst den Weg durch die Wirbelsäule zurück. <break time="2s"/>
                                
                                Weiter und weiter führt der Weg.
                                
                                Dort, wo du Verspannungen spürst, kannst du sie lösen.
                                
                                Durch das linke Bein kehrst du zum linken Fuß zurück. Und trittst aus dem Körper heraus.
                                
                                Du schaust dich an, wie du auf dem Boden liegst.
                                
                                Und dann kehrst du in dein Bewusstsein zurück.
                                
                                <break time="4s"/>
                                <audio src="https://s3.amazonaws.com/ask-soundlibrary/nature/amzn_sfx_ocean_wave_surf_01.mp3" />
                                </prosody> </voice>`,
                                
            FOOD_TIPPS: [' Wie wäre es mit gerösteten Kichererbsen? Der perfekte Snack für zwischendurch.', 'Mache dir dein eigenes Studentenfutter und röste verschiedene Nussarten zusammen im Ofen.', 'Wie wäre es mit Gurke, Karotte und einem Kräuterquark?'], 
            CONCENTRATION_EXERCISE: [` <audio src="soundbank://soundlibrary/nature/amzn_sfx_strong_wind_whistling_01"/> <voice name="Vicki"> Die folgende Konzentrationsübung heißt: Rückwärts erinnern. Weißt du noch, was du in der letzten halben Stunde alles gemacht hast? Gehe  alle Schritte im Kopf durch, aber denke  dabei rückwärts. Beginne mit dem letzten Ereignis und gehe die halbe Stunde Stück für Stück rückwärts durch. Alternativ kannst du auch überlegen, wo du vor drei Mouseklicks warst. Wenn du zum Beispiel eine Internetrecherche betreibst, bietet sich diese Übung gut an. Mogeln und in den Verlauf schauen gilt natürlich nicht. Du wirst merken, es ist gar nicht so leicht. Dafür kommst du dabei zur Ruhe und regst deine Konzentration an. </voice>`,
                                    `  <audio src="soundbank://soundlibrary/nature/amzn_sfx_strong_wind_whistling_01"/> <voice name="Vicki"> Die nachfolgende Übung heißt Die Wörter im Wort finden
                                        Suche dir ein beliebiges Wort aus und überlege, wie viele zusätzliche Begriffe sich in diesem Wort befinden, indem du die vorhandenen Buchstaben neu kombinierst. Du wirst überrascht sein, wie viel man findet. Hier ein paar Beispiele:
                                        Berufsunfähigkeitsversicherung: heiter, Bär, Heu, Tier, Tee, Fee, rufen
                                        Altersvorsorge: See, Rose, Ass, Vater, Elster, Reste, Regel
                                        Konzentrationsübung: gut, Ration, Trotz, nett, Trio, kurz, Büro, Tier </voice>`],
            ACTIVATION_EXERCISE: `<audio src="soundbank://soundlibrary/water/nature/nature_05"/> 
                                    <voice name="Vicki"> 
                                    Die folgende Aktivierungsübung nennt sich: Ausfallschritt nach vorne beziehungsweiße Ellbogen zum Fuß.
                                    
                                    Ausgangsposition: Stell dich aufrecht hin und mache mit dem linken Bein einen großen Ausfallschritt nach vorne. <break time="3s"/>
                                    
                                    Nun zur Ausführung: Stütz dich mit dem rechten Arm auf dem Boden ab und verteil dein Gewicht auf die rechte Hand und den linken Fuß. Bringe dabei den linken Ellbogen zum Spann des vorderen Fußes, ohne mit dem rechten Knie den Boden zu berühren. <break time="3s"/> 
                                    
                                    
                                    Platziere dann die linke Hand an der Außenseite des linken Fußes und stemme dich mit beiden Armen nach oben.
                                    
                                    
                                    Ziehe dabei die Fußspitze des linken Fußes Richtung Schienbein, wobei das vordere Bein kurz in die Streckung kommt. Wiederholt den Ausfallschritt mit dem rechten Bein. <break time="3s"/>
                                     <break time="3s"/>
                                     
                                    Du solltest jetzt Eine Dehnung in der Leistengegend spüren, in den Hüftbeugern des hinteren Beines und im Gesäßmuskel des vorderen Beines, im zweiten Teil der Übung eine Dehnung an der Oberschenkelrückseite und in der Wade des vorderen Beins
                                     <break time="3s"/> 
                                     
                                     Mit dieser Übung flexiblilisierst du den Hüftmuskeln, den Oberschenkelvorder- und -rückseiten, die  Muskeln im unteren Rücken, im Rumpf und in den Leisten.
                                    
                                    Achte darauf, dass das hintere Knie nicht den Boden berührt. Atmet aus, während du den Ellbogen zum Spann bringst. Beim Hochstemmen des Beckens und Anziehen der vorderen Fußspitze müssen beide Hände in Kontakt mit dem Boden bleiben.</voice>`,
            LEARNING_TIPPS: [' Gehe doch in der Pause eine Runde spazieren, das kann helfen, den Kopf freizubekommen.',' Überlege dir doch mal, ob du an einem Tag mit einem Freund oder Freundin lernen möchstest.', ' Bewegung und Sport sorgen dafür, dass dein Kopf frei wird und auf andere Gedanken kommt. Mache zum Beispiel eine geführte Yoga-Stunde oder ein 15-minütiges Workout.', 'Wenn du dich gerne ablenken lässt, versuche doch mal dein Handy komplett auszuschalten, um nicht in die Versuchung zu kommen, dich wieder ablenken zu lassen.', 'Im Prinzip läuft es beim Studieren wie bei der Tour de France: Würdest du die komplette Strecke am Stück fahren, wärst du nach kurzer Zeit erschöpft; du würdest nicht weit kommen. Deshalb teilst du den Weg in Etappen auf und fährst Stück für Stück. Du legst regelmäßig Pausen ein und tankst zwischendurch Kraft, damit du danach mit vollen Energiereserven weitermachen kannst.', ' Eine Pause, in der du dich nicht erholst, ist genauso viel Wert, wie gar keine Pause: nämlich gar nichts. Mach dir deshalb klar, dass Pausen ein festes Ziel haben und verpflichte dich dazu, diesem Ziel zu folgen.', ' Ein kleiner Tipp von mir: Schreibe vor jeder Pause all deine Gedanken auf und verbanne sie damit aus deinem Kopf. Dazu kannst du zum Beispiel eine Mindmap erstellen oder die GTD-Methode nutzen. Mache dir außerdem eine kurze Notiz, an welcher Stelle du beim Lernen stehengeblieben bist, damit dir der Wiedereinstieg nach der Pause leichter fällt.', 'Ein Tipp von mir: Sage dir vor jeder Pause, wie wichtig die kommende Unterbrechung sein wird und dass du danach stärker und konzentrierter zurückkehren wirst. Lege außerdem ein Ziel der Pause fest und schreibe diese Vorgabe verbindlich auf.', 'Ein Tipp von mir:  Überfordere dich in deinen Lernpausen nicht. Reduziere andere inhaltliche Einflüsse auf ein Minimum und entlaste deine grauen Zellen, damit sie sich im Anschluss wieder voll und ganz auf deinen Lernstoff einlassen können.'],
            LEARNING_TIPPS_AUDIO: ['Als kleiner Tipp: lese doch mal für dich selbst laut vor. ', 'Probiere doch mal Aufzeichnungen zu machen und sie dir anschließend anzuhören. ', ' Ein Tipp ist, dir eine ruhige Arbeitsatmosphäre zu verschaffen. ', ' Wenn möglich, höre dir doch noch mal Aufzeichnungen von Vorlesungen an.'],
            LEARNING_TIPPS_VISUAL: ['Kleiner Tipp: Versuche vielleicht mal gezielt mit Infografiken zu lernen. ', 'Probiere doch mal Lernkarten mit Bildern zu versehen, um dir Eselsbrücken zu schaffen. ', 'Hast du schon mal probiert Mind-Maps zu erstellen, um Gelerntes und Gedankengänge zu visualisieren? Probiere es doch mal aus! '],
            LEARNING_TIPPS_MOTORIC: ['Suche dir Übungsaufgaben im Internet, die dir weiterhelfen können. ', 'Probiere doch mal eigene Übungsaufgaben zu entwickeln und teile sie mit deinen Freunden. So könnt ihr gegenseitig neue Übungsaufgaben machen. ', 'Überlege dir doch mal Berichtshefte und Lernkarten zu erstellen.', ' Ein kleiner Tipp: Nutze doch mal Stressbälle zum Kneten oder andere Gegenstände für Deine Konzentration. '],
            LEARNING_TIPPS_COMM: ['Probiere doch mal Mini-Vorträge zu allen Teilgebieten des Lernstoffes vorzubereiten und vor Deiner Lerngruppe zu halten. Eine Win-Win-Situation für alle Beteiligten.', 'Probiere doch mal, dir eine aktive und motivierte Lerngruppe zu suchen und mit ihnen gemeinsam zu lernen. Bereite dort dann zum Beispiel Diskussionen mit unterschiedlichen Standpunkten vor.', 'Probiere doch mal für dich selbst Präsentationen zu erstellen und zu halten zum Lernstoff', 'Als Tipp: Versuche Freunden oder Familie den Lernstoff verständlich zu erklären. ', 'Probiere in deiner Freizeit Vorkommnisse mit dem gelernten Stoff zu verküpfen. '],
            
            VISUAL_TYPE: 'Laut deiner Antworten neigst du zu einem visuellen Lerntyp. Wenn Du eher ein visueller Lerntyp bist, fällt dir das Lernen bei Lehrern und Professoren, die viel gestikulieren und eine bildstarke Sprache benutzen, wesentlich leichter. Außerdem spiegelt sich das auch in Deinen Notizen wieder: neben Text notierst Du vermutlich auch viele Symbole und machst gerne Tabellen und Skizzen.',
            AUDIO_TYPE: 'Laut deiner Antworten neigst du zu einem auditiven Lerntyp. Wenn Du zu den auditiven Lerntypen gehörst, ist die gute alte Vorlesung für Dich eigentlich eine gute Sache. Denn Du kannst sehr gut zuhören und es fällt Dir auch über lange Strecken nicht schwer aufmerksam zu bleiben und das Gehörte regelrecht aufzusaugen. Das gesprochene Wort ist für Dich der Schlüssel zum Lernerfolg. Das spiegelt sich auch in Deinen Notizen wieder, weil Du Dich vor allem auf das Zuhören konzentrierst, fallen die oft eher knapp aus. ',
            MOTORIC_TYPE: 'Laut deiner Antworten neigst du zu einem motorischen Lerntyp.Wenn Du zu diesen Lerntypen gehörst, musst Du Dinge einfach ausprobieren und selbst anpacken, um sie zu verstehen und letztlich zu verinnerlichen. Als haptischer Lerntyp kommen Dir dabei vor allem Aufgaben entgegen, bei denen Du auch tatsächlich die Hände einsetzen kannst. Oder auch Dinge einfach genau ertasten und erfühlen kannst. Der kinästhetische Lerntyp profitiert auch bei nicht-handwerklichen Aufgaben von praktischer Übung. Indem beispielsweise in Computerprogrammen bestimmte Funktionen einfach mit Praxisbezug eingeübt werden. ',
            KOMM_TYPE: 'Laut deiner Antworten neigst du zu einem kommunikativen Lerntyp. Besonders angeregte Diskussionen und Gespräche helfen Dir dabei, Dinge zu verinnerlichen sowie Sachverhalte zu verstehen und einzuordnen. Aber auch das Halten von Vorträgen hilft Dir weiter – Hauptsache die Kommunikation mit anderen steht im Mittelpunkt. Denn später helfen Dir Details aus Gesprächsverläufen sowie Argumente aus Diskussionen, um Dich an Sachverhalte und Gelerntes zu erinnern.',
            
            INFO_LEARNTYPE: 'Du möchtest also herausfinden, welcher Lerntyp du bist. Ich werde dir daher anschließend zwölf Fragen stellen. Diese beantwortest du bitte mit trifft zu, trifft teilweise zu oder trifft nicht zu. ',
            GOOD_MOOD_FINISH: 'Das freut mich, dass dein Lerntag  so gut liefen. Dann kannst du dich jetzt auf deine Belohnung freuen. Falls du deinen Lernfortschritt für heute speichern möchtest, sage: Speichere Lernfortschritt.',
            OKAY_MOOD_FINISH: 'Es ist vollkommen okay, mal einen nur mittelmäßigen Lerntag zu haben. Nutze die Zeit heute noch, um etwas schönes zu unternehmen. Falls du deinen Lernfortschritt für heute speichern möchtest, sage: Speichere Lernfortschritt.',
            BAD_MOOD_FINISH: 'Es ist nicht schlimm, einen schlechten Lerntag zu haben. Denke mal darüber nach, was dir helfen könnte. Vielleicht lernst du mal mit einem Freund zusammen. Aber für heute hast du es jetzt erstmal geschafft. Falls du deinen Lernfortschritt für heute speichern möchtest, sage: Speichere Lernfortschritt.',
            THIRTY_MIN_PAUSE_STARTS: 'Deine 30 Minütige Pause beginnt jetzt. ',
            SIXTY_MIN_PAUSE_STARTS: 'Deine 60 Minütige Pause beginnt jetzt. ',
            DAYS_LEFT_MSG: `{{name}}, es sind noch {{count}} Tage übrig, bis du deine Klausur in {{subject}} schreibst. Wenn du noch eine Erinnerung für deine Klausur möchtest, sage bitte: Erinnere mich an die Klausur. `,
            EXAM_REMINDER_CREATED_MSG: 'Ich werde dich zwei Tage vorher an deine Klausur erinnern. Was möchtest du als nächstes tun? ',
            MISSING_EXAM_MSG: 'Du hast mir wohl noch nicht erzählt, wann die Klausur stattfinden wird.'
            //Lerntipps
            //Entspannungsübungen
        }
    }
}