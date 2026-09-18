/**
 * French destination hooks, keyed by slug.
 *
 * An overlay rather than a second field on DESTINATIONS. The data file stays
 * a data file and knows nothing about locales; a missing entry here falls
 * back to the English hook on its own, so a destination added tomorrow is
 * never a blank card in French.
 *
 * Only the hooks. Names and flags are proper nouns, and the long-form
 * destination pages live in destination-details.ts -- roughly five thousand
 * strings, which is a translation project rather than a file. Until those
 * exist, /fr/destinations/<slug> is held out of the French sitemap and
 * hreflang set and carries noindex (see isTranslatedPath in lib/i18n.ts).
 */
export const DESTINATION_HOOKS_FR: Record<string, string> = {
  portugal: "Littoral atlantique, villes en azulejos, et parmi les vols les moins chers d’Europe.",
  switzerland: "Trains alpins, villages au bord des lacs, et des correspondances faciles vers tous les pays voisins.",
  netherlands: "Villes de canaux et un aéroport pivot qui simplifie la suite du voyage.",
  croatia: "Îles adriatiques et vieilles villes fortifiées le long d’une seule route côtière.",
  italy: "Villes d’art, littoral, et une cuisine qui vaut qu’on organise l’itinéraire autour.",
  spain: "Plages, capitales historiques, et quelques-unes des liaisons aériennes les plus fréquentées d’Europe.",
  vietnam: "Un itinéraire du nord au sud, entre montagnes, côte et vieux quartiers.",
  "south-korea": "Les quartiers de Séoul, les villes côtières, et un train rapide entre les deux.",
  "sri-lanka": "Hautes terres, littoral et parcs animaliers sur une boucle compacte.",
  japan: "Trains à grande vitesse entre villes néon, cités de temples et onsen de montagne.",
  thailand: "Cuisine de rue, plages insulaires et temples des collines du Nord sur un même billet.",
  indonesia: "Volcans, récifs et rizières en terrasses sur des milliers d’îles.",
  "united-states": "Parcs nationaux, villes côtières et road trips dans toutes les régions.",
  canada: "Montagnes, lacs et villes réparties sur un pays grand comme un continent.",
  brazil: "Littoral, forêt amazonienne et des villes qui vivent la nuit.",
  mexico: "Ruines, villages de bord de mer et cuisine de rue dans chaque région.",
  peru: "Sentiers andins, villes coloniales et accès à l’Amazonie en un seul voyage.",
  argentina: "Glaciers, vignobles et une capitale faite pour les longs dîners.",
  martinique:
    "La France aux Caraïbes -- distilleries de rhum, un volcan en activité et des plages sur les deux côtes.",
  guadeloupe:
    "Deux îles reliées par un pont : forêt tropicale et cascades d’un côté, sable blanc de l’autre.",
  cuba: "La vieille Havane, les vallées à tabac et un littoral encore largement préservé.",
  "dominican-republic":
    "Les plages les plus animées des Caraïbes, plus la montagne et la saison des baleines.",
  jamaica: "Les Blue Mountains, les cascades et la longue enfilade de plages de la côte nord.",
  bahamas: "Sept cents îles, des bancs turquoise peu profonds, et le saut le plus court depuis la Floride.",
  egypt: "Sites antiques le long du Nil et littoral de la mer Rouge.",
  "south-africa": "Pays de safari, littoral et vallées viticoles à moins d’une journée de route.",
  kenya: "Parcs de safari et un littoral qui mérite de prolonger le voyage.",
  namibia: "Dunes du désert, faune sauvage et parmi les ciels nocturnes les plus purs au monde.",
  morocco: "Médinas, cols de montagne et campements sahariens à quelques heures les uns des autres.",
  tanzania: "Le Serengeti, un cratère volcanique endormi, et Zanzibar pour finir.",
  jordan: "Canyons désertiques, ruines antiques et la mer Rouge à deux pas.",
  oman: "Montagnes, wadis et littoral, sans la foule.",
  qatar: "Une ville d’escale faite pour réussir une longue correspondance.",
  "united-arab-emirates": "Dubaï et Abu Dhabi, avec le désert et la plongée à une heure de l’une ou l’autre.",
  "saudi-arabia":
    "Les tombeaux taillés dans la roche d’AlUla, les récifs de la mer Rouge, et un pays tout juste ouvert aux visiteurs.",
  turkey: "Les deux continents d’Istanbul, les vallées de Cappadoce et une longue côte égéenne.",
  australia: "Littoral, outback et villes réparties sur tout un continent.",
  "new-zealand": "Fjords, glaciers et des routes faites pour s’arrêter souvent.",
  fiji: "Cabotage entre les îles et plongée sur récif dans le Pacifique Sud.",
  "french-polynesia": "Bungalows sur pilotis, lagons et pics volcaniques sur 118 îles.",
  "new-caledonia": "Le plus grand lagon du monde, des pins colonnaires, et la France dans le Pacifique Sud.",
  samoa: "Trous d’eau, cascades et fales de plage posés sur le sable.",
};
