import type { Locale } from "./i18n";

export const TOPICS = ["4c", "formen", "zertifikate", "herkunft", "fluoreszenz", "kaufberatung"] as const;
export type TopicSlug = (typeof TOPICS)[number];
export const isTopic = (s: string): s is TopicSlug => (TOPICS as readonly string[]).includes(s);

type Block = { heading: string; paragraphs: string[] };
type Topic = { title: string; intro: string; sections: Block[] };

const topics: Record<TopicSlug, Record<Locale, Topic>> = {
  "4c": {
    de: {
      title: "Die 4C",
      intro: "Vier Angaben beschreiben einen geschliffenen Diamanten: Karat, Farbe, Reinheit und Cut. Die Form, etwa Rund oder Oval, ist eine eigene Entscheidung und kein fünftes C.",
      sections: [
        { heading: "Karat", paragraphs: ["Karat ist das Gewicht, nicht der Durchmesser. Ein Karat entspricht 0,2 Gramm. Zwei Steine mit gleichem Gewicht können unterschiedlich groß wirken, wenn Tiefe und Form abweichen. In der Suche filtern Sie einen Bereich, statt sich auf eine einzelne Zahl festzulegen."] },
        { heading: "Farbe", paragraphs: ["Die Skala läuft von D, farblos, nach Z, deutlich getönt. Dieser Katalog zeigt D bis M. Der Unterschied zwischen Nachbarbuchstaben ist ohne Vergleich oft kaum sichtbar. Viele wählen im Bereich G bis J, weil der Stein noch hell wirkt und die seltensten Buchstaben nicht nötig sind."] },
        { heading: "Reinheit", paragraphs: ["Reinheit beschreibt Merkmale im Stein, beurteilt bei zehnfacher Vergrößerung. FL und IF sind ohne bzw. mit kaum inneren Merkmalen. VVS, VS und SI folgen, danach I1 bis I3. Ein Merkmal unter der Tafel fällt eher auf als eines am Rand."] },
        { heading: "Cut", paragraphs: ["Cut meint die Schliffausführung: Proportionen, Politur und Symmetrie, und wie das Licht zurückkommt. Das ist nicht dasselbe wie die Umrissform. Formale Cut-Noten sind am eindeutigsten beim runden Brillanten. Bei anderen Formen lesen wir Politur, Symmetrie, Tafel und Tiefe mit."] },
      ],
    },
    en: {
      title: "The 4Cs",
      intro: "Four figures describe a polished diamond: carat, colour, clarity and cut. The outline, such as round or oval, is a separate choice and not a fifth C.",
      sections: [
        { heading: "Carat", paragraphs: ["Carat is weight, not diameter. One carat is 0.2 grams. Two stones of the same weight can look different in size when depth and shape differ. The search uses a range rather than a single number."] },
        { heading: "Colour", paragraphs: ["The scale runs from D, colourless, toward Z, noticeably tinted. This catalog shows D to M. Neighbouring letters are often hard to see without a comparison. Many people look around G to J, where the stone still reads light and the rarest letters are unnecessary."] },
        { heading: "Clarity", paragraphs: ["Clarity describes features inside the stone, judged at ten-times magnification. FL and IF have none or almost no internal features. VVS, VS and SI follow, then I1 to I3. A mark under the table is easier to see than one at the edge."] },
        { heading: "Cut", paragraphs: ["Cut means how the stone was finished: proportions, polish and symmetry, and how light returns. It is not the same as the outline. Formal cut grades are clearest on round brilliants. On other shapes we read polish, symmetry, table and depth alongside."] },
      ],
    },
  },
  formen: {
    de: {
      title: "Schliffarten",
      intro: "Die Form ist der Umriss von oben. Fatlum führt zehn Formen. Der Name Smaragdschliff bezeichnet die Form, nicht den Edelstein Smaragd.",
      sections: [
        { heading: "Brillant und eckige Formen", paragraphs: ["Der runde Brillant ist die verbreitetste Form und diejenige, für die Cut-Noten am klarsten definiert sind. Prinzess ist quadratisch mit spitzen Ecken. Radiant und Kissen sind ebenfalls eckig, das Kissen mit weicheren Ecken, der Radiant mit beschnittenen Ecken und oft mehr Feuer."] },
        { heading: "Längliche Formen", paragraphs: ["Oval, Tropfen und Navette strecken das Licht in die Länge. Die Navette ist an beiden Enden spitz, der Tropfen an einem. Achten Sie im Vergleich auf das Verhältnis von Länge zu Breite: sehr lang wirkt schmal, sehr kurz fast rund."] },
        { heading: "Stufen und Herz", paragraphs: ["Smaragdschliff und Asscher sind Stufenschliffe mit langen, offenen Flächen. Sie zeigen Einschlüsse eher als ein Brillant, dafür wirkt die Fläche ruhig. Das Herz ist eine Umrissform; die Kerbe oben sollte im Bericht und im Bild gleichmäßig sitzen."] },
      ],
    },
    en: {
      title: "Shapes",
      intro: "Shape is the outline from above. Fatlum carries ten shapes. The emerald cut is a shape, not the gemstone emerald.",
      sections: [
        { heading: "Brilliant and square outlines", paragraphs: ["The round brilliant is the most common shape and the one for which cut grades are defined most clearly. Princess is square with sharp corners. Radiant and cushion are square-ish as well: cushion with softer corners, radiant with cropped corners and often more fire."] },
        { heading: "Elongated outlines", paragraphs: ["Oval, pear and marquise stretch the light lengthwise. Marquise is pointed at both ends, pear at one. In a comparison, watch the length-to-width ratio: very long looks narrow, very short looks almost round."] },
        { heading: "Step cuts and heart", paragraphs: ["Emerald and Asscher are step cuts with long, open facets. They show inclusions more readily than a brilliant, and the face looks calmer. The heart is an outline; the cleft should sit evenly in the report and in the drawing."] },
      ],
    },
  },
  zertifikate: {
    de: {
      title: "Zertifikate und Labore",
      intro: "Fatlum bietet Diamanten mit Bericht von GIA, IGI, HRD und weiteren anerkannten Laboren an, darunter AGS, GCAL und GSI. Jedes Labor lässt sich filtern. Wir setzen keine Zeichen dieser Institute.",
      sections: [
        { heading: "Was ein Bericht festhält", paragraphs: ["Ein Laborbericht identifiziert den Stein über Maße und oft eine Einschlusszeichnung, und er notiert Karat, Farbe, Reinheit, Politur, Symmetrie, Fluoreszenz und bei runden Brillanten meist eine Cut-Note. Die Berichtsnummer im Beispielkatalog beginnt mit EXAMPLE und ist keine echte Nummer."] },
        { heading: "Wie wir die Labore behandeln", paragraphs: ["GIA, IGI, HRD, AGS, GCAL, GSI und weitere anerkannte Labore arbeiten mit eigenen Skalen. Wir geben die Note so wieder, wie sie auf dem Bericht steht, und übersetzen sie nicht in eine hausinterne Punktzahl. Welches Labor zu einem Stein gehört, steht in der Suche und auf der Detailseite."] },
        { heading: "Was Sie mit der Anfrage bekommen", paragraphs: ["Im persönlichen Angebot nennen wir den Bericht, den wir zum Stein mitgeben. Einen Beispielstein können Sie nicht als geprüfte Ware kaufen. Sobald echter Bestand angebunden ist, bleibt die Kennzeichnung EXAMPLE nur an den Mustern."] },
      ],
    },
    en: {
      title: "Certificates and laboratories",
      intro: "Fatlum offers diamonds with a report from GIA, IGI, HRD and other recognised laboratories, including AGS, GCAL and GSI. Each laboratory can be filtered. We do not use those institutes’ marks.",
      sections: [
        { heading: "What a report records", paragraphs: ["A laboratory report identifies the stone through measurements and often a plot of features, and it records carat, colour, clarity, polish, symmetry, fluorescence and, on round brilliants, usually a cut grade. Report numbers in the example catalog start with EXAMPLE and are not real numbers."] },
        { heading: "How we treat the laboratories", paragraphs: ["GIA, IGI, HRD, AGS, GCAL, GSI and other recognised laboratories use their own scales. We repeat the grade as printed on the report and do not convert it into a house score. Which laboratory belongs to a stone is shown in the search and on the detail page."] },
        { heading: "What the request includes", paragraphs: ["The personal offer names the report we supply with the stone. An example stone cannot be bought as inspected goods. When real stock is connected, the EXAMPLE mark stays only on the samples."] },
      ],
    },
  },
  herkunft: {
    de: {
      title: "Natur und laborgezüchtet",
      intro: "Beide sind kristalliner Kohlenstoff. Der Unterschied ist die Entstehung. Fatlum kennzeichnet die Herkunft an jedem Stein und vermischt die beiden Gruppen nicht.",
      sections: [
        { heading: "Naturdiamant", paragraphs: ["Ein Naturdiamant ist in der Erde entstanden. Der Bericht soll die Herkunft als natürlich ausweisen. Wir geben keine zusätzliche Herkunftsplakette aus, die wir nicht belegen können, und wir wiederholen keine fremden Zertifizierungsversprechen."] },
        { heading: "Laborgezüchtet", paragraphs: ["Ein laborgezüchteter Diamant entsteht in einem technischen Prozess und kann ebenfalls einen Laborbericht tragen. In der Suche filtern Sie ihn getrennt. Optisch kann er einem Naturstein nahekommen. Die Kennzeichnung bleibt auf dem Angebot und, wo üblich, auf dem Bericht."] },
        { heading: "Was wir nicht behaupten", paragraphs: ["Wir sagen nicht, eine der beiden Gruppen sei pauschal die bessere Wahl. Der Preisunterschied erscheint nur im persönlichen Angebot, nicht auf dieser Seite. Angaben zu recycelten oder sekundären Edelmetallen gehören zum Goldhaus von Fatlum und werden hier nicht auf Diamanten übertragen."] },
      ],
    },
    en: {
      title: "Natural and lab-grown",
      intro: "Both are crystalline carbon. The difference is how they formed. Fatlum marks origin on every stone and does not mix the two groups.",
      sections: [
        { heading: "Natural diamond", paragraphs: ["A natural diamond formed in the earth. The report should state that origin. We do not add an extra origin seal we cannot document, and we do not repeat another company’s certification claims."] },
        { heading: "Lab-grown", paragraphs: ["A lab-grown diamond is made in a technical process and can carry a laboratory report as well. The search filters it separately. Visually it can sit close to a natural stone. The label stays on the offer and, where usual, on the report."] },
        { heading: "What we do not claim", paragraphs: ["We do not say that either group is automatically the better choice. Any price difference appears only in the personal offer, not on this page. Statements about recycled or secondary precious metals belong to Fatlum’s gold house and are not applied to diamonds here."] },
      ],
    },
  },
  fluoreszenz: {
    de: {
      title: "Fluoreszenz",
      intro: "Fluoreszenz ist die Reaktion des Steins auf ultraviolettes Licht. Der Bericht stuft sie von keiner bis sehr stark, oft mit einer Farbe, häufig Blau.",
      sections: [
        { heading: "Was Sie sehen", paragraphs: ["Bei Tageslicht mit UV-Anteil kann eine starke Fluoreszenz den Stein milchig wirken lassen oder, bei Blau, einen warmen Farbstich optisch kühlen. Keine oder schwache Fluoreszenz bleibt im Alltag meist unauffällig. Mittel bis sehr stark ist eine Vorliebe, kein automatischer Fehler."] },
        { heading: "Im Katalog", paragraphs: ["Die Suche filtert die Stufe, die auf dem Beispielbericht steht. Auf der Detailseite steht dieselbe Stufe in der Tabelle. Wenn Sie zwei Steine vergleichen, legen Sie sie nebeneinander und lesen die Fluoreszenz mit, statt sie nur als Ja oder Nein zu behandeln."] },
      ],
    },
    en: {
      title: "Fluorescence",
      intro: "Fluorescence is the stone’s reaction to ultraviolet light. The report grades it from none to very strong, often with a colour, frequently blue.",
      sections: [
        { heading: "What you see", paragraphs: ["In daylight that contains UV, strong fluorescence can make a stone look milky or, with blue, visually cool a warm tint. None or faint usually stays quiet in daily light. Medium to very strong is a preference, not an automatic fault."] },
        { heading: "In the catalog", paragraphs: ["The search filters the grade printed on the example report. The detail page repeats that grade in the table. When you compare two stones, set them side by side and read fluorescence with the other grades instead of treating it as only yes or no."] },
      ],
    },
  },
  kaufberatung: {
    de: {
      title: "Kaufberatung",
      intro: "Es gibt keine Kasse und keine Preisliste. Der Weg ist: suchen, vergleichen, anfragen, Angebot lesen.",
      sections: [
        { heading: "Zuerst die Form", paragraphs: ["Entscheiden Sie den Umriss, bevor Sie die Noten eng stellen. Ein Oval und ein Rund mit gleichen 4C wirken im Ring verschieden. Die Formfilter lassen sich kombinieren, wenn Sie zwei Umrisse offenhalten."] },
        { heading: "Dann die Balance", paragraphs: ["Farbe und Reinheit tauschen oft Wirkung. Ein hellerer Stein mit einer sichtbaren Reinheit und ein etwas wärmerer Stein mit einer ruhigeren Reinheit können im Vergleich näher beieinanderliegen, als die Buchstaben vermuten lassen. Cut, Politur und Symmetrie lesen Sie mit."] },
        { heading: "Anfrage", paragraphs: ["Legen Sie bis zu vier Steine in den Vergleich und die gewünschten Steine auf die Anfrageliste. Das Formular fragt Name, E-Mail, Telefon, optional die Firma, eine Nachricht und Ihre Einwilligung. Sie zahlen auf dieser Seite nichts. Ein Vertrag entsteht erst, wenn Sie ein schriftliches Angebot annehmen. Besichtigung in München sprechen wir im Angebot ab. Die Öffnungszeiten stehen noch aus."] },
      ],
    },
    en: {
      title: "Buying guide",
      intro: "There is no checkout and no price list. The path is: search, compare, request, read the offer.",
      sections: [
        { heading: "Shape first", paragraphs: ["Decide the outline before you tighten the grades. An oval and a round with the same 4Cs look different in a ring. Shape filters can be combined if you want to keep two outlines open."] },
        { heading: "Then the balance", paragraphs: ["Colour and clarity often trade appearance. A lighter stone with a more visible clarity and a slightly warmer stone with a quieter clarity can sit closer together in a comparison than the letters suggest. Read cut, polish and symmetry with them."] },
        { heading: "The request", paragraphs: ["Put up to four stones in the comparison and the ones you want on the request list. The form asks for name, email, phone, an optional company, a message and your consent. You pay nothing on this page. A contract starts only when you accept a written offer. A viewing in Munich is arranged in the offer. Opening hours are still to follow."] },
      ],
    },
  },
};

export function getTopic(slug: TopicSlug, l: Locale) {
  return topics[slug][l];
}

export function topicCards(l: Locale): { slug: TopicSlug; title: string; intro: string }[] {
  return TOPICS.map((slug) => ({ slug, title: topics[slug][l].title, intro: topics[slug][l].intro }));
}

export function faqItems(l: Locale): { q: string; a: string }[] {
  if (l === "en") {
    return [
      { q: "Why are there no prices?", a: "Fatlum Diamonds confirms every stone in a personal offer. The site has no price column, no guide price and no checkout." },
      { q: "Are these stones in stock?", a: "No. The catalog is example data, marked EXAMPLE in the item number and the certificate number. It shows how search, comparison and the request list work." },
      { q: "Which certificates do you offer?", a: "Reports from GIA, IGI, HRD and other recognised laboratories, including AGS, GCAL and GSI. All of them can be filtered. Numbers containing EXAMPLE on this site are samples, not reports you can look up." },
      { q: "Do you sell natural and lab-grown diamonds?", a: "Yes, always labelled. Use the origin filter to keep them apart. We do not claim an extra origin certification we cannot show." },
      { q: "How many stones can I compare?", a: "Four. The comparison lists specifications only." },
      { q: "What happens to my request?", a: "It is stored in the Fatlum database. If email delivery is configured, we send a confirmation and an internal notice. If it is not, the request is still stored and we read it there." },
      { q: "Do I pay on this page?", a: "No. Nothing is charged here. A purchase starts only after you accept a written offer." },
      { q: "Can I see a stone in Munich?", a: "Ask in the message. The address is Maximilianstraße 2, 80539 Munich. Opening hours are not fixed yet." },
      { q: "Is investment-gold VAT treatment relevant here?", a: "No. That note belongs to Fatlum Gold. Diamond tax treatment is stated in the offer, not assumed on this site." },
      { q: "Where are rings and gold bars?", a: "Rings are on Fatlum Jewelry, bars on Fatlum Gold. This site is only loose diamonds." },
    ];
  }
  return [
    { q: "Warum stehen keine Preise auf der Seite?", a: "Fatlum Diamonds bestätigt jeden Stein in einem persönlichen Angebot. Es gibt keine Preisspalte, keinen Richtpreis und keine Kasse." },
    { q: "Sind diese Steine verfügbar?", a: "Nein. Der Katalog ist Beispieldaten, gekennzeichnet mit EXAMPLE in der Artikelnummer und der Zertifikatsnummer. Er zeigt, wie Suche, Vergleich und Anfrageliste funktionieren." },
    { q: "Welche Zertifikate bieten Sie an?", a: "Berichte von GIA, IGI, HRD und weiteren anerkannten Laboren, darunter AGS, GCAL und GSI. Alle lassen sich filtern. Nummern mit EXAMPLE auf dieser Seite sind Muster, keine abrufbaren Berichte." },
    { q: "Führen Sie Naturdiamanten und laborgezüchtete Steine?", a: "Ja, immer gekennzeichnet. Der Herkunftsfilter trennt sie. Eine zusätzliche Herkunftszertifizierung, die wir nicht belegen können, sprechen wir nicht aus." },
    { q: "Wie viele Steine kann ich vergleichen?", a: "Vier. Der Vergleich zeigt nur die Angaben, keine Preise." },
    { q: "Was passiert mit meiner Anfrage?", a: "Sie wird in der Fatlum-Datenbank gespeichert. Wenn der E-Mail-Versand eingerichtet ist, geht eine Bestätigung an Sie und ein Hinweis an uns. Wenn nicht, liegt die Anfrage trotzdem vor und wir lesen sie dort." },
    { q: "Zahle ich auf dieser Seite?", a: "Nein. Hier wird nichts berechnet. Ein Kauf beginnt erst, wenn Sie ein schriftliches Angebot annehmen." },
    { q: "Kann ich einen Stein in München sehen?", a: "Schreiben Sie es in die Nachricht. Die Adresse ist Maximilianstraße 2, 80539 München. Öffnungszeiten stehen noch nicht fest." },
    { q: "Gilt die Umsatzsteuerbefreiung für Anlagegold auch hier?", a: "Nein. Dieser Hinweis gehört zu Fatlum Gold. Die steuerliche Behandlung von Diamanten steht im Angebot, nicht als Annahme auf dieser Seite." },
    { q: "Wo sind Ringe und Goldbarren?", a: "Ringe liegen bei Fatlum Jewelry, Barren bei Fatlum Gold. Diese Seite führt nur lose Diamanten." },
  ];
}

export function aboutParagraphs(l: Locale): string[] {
  if (l === "en") {
    return [
      "Fatlum works from Maximilianstraße 2, 80539 Munich. The house is known for precious metals. Fatlum Diamonds is the loose-diamond desk of the same house, with its own address for mail: info@fatlum.diamonds, phone +49 89 20 500 85858.",
      "The legal entity, the managing directors, the commercial register and the VAT identification number are not published here yet. Those lines are marked as placeholders on the imprint.",
      "Fatlum’s gold business may describe recycled and secondary precious metals. That sentence does not travel onto a diamond. On this site we state laboratory, measurements and whether a stone is natural or lab-grown, and we stop there.",
      "The stones you can search today are examples, drawn so that every shape, both origins and the laboratories we work with appear. They are labelled EXAMPLE in the data and on the screen. They are not an offer.",
    ];
  }
  return [
    "Fatlum arbeitet in der Maximilianstraße 2, 80539 München. Das Haus ist für Edelmetalle bekannt. Fatlum Diamonds ist der Schreibtisch für lose Diamanten desselben Hauses, mit eigener Postadresse info@fatlum.diamonds und Telefon +49 89 20 500 85858.",
    "Rechtsform, Geschäftsführung, Handelsregister und Umsatzsteuer-Identifikationsnummer stehen hier noch nicht. Diese Zeilen sind im Impressum als Platzhalter markiert.",
    "Das Goldgeschäft von Fatlum darf recycelte und sekundäre Edelmetalle benennen. Dieser Satz wandert nicht auf einen Diamanten. Auf dieser Seite nennen wir Labor, Maße und ob ein Stein natürlich oder laborgezüchtet ist, und dabei bleibt es.",
    "Die Steine, die Sie heute suchen können, sind Beispiele. Sie sind so gesetzt, dass jede Form, beide Herkünfte und die Labore, mit denen wir arbeiten, vorkommen. Sie tragen EXAMPLE in den Daten und auf dem Bildschirm. Sie sind kein Angebot.",
  ];
}
