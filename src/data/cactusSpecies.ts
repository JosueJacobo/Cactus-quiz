export interface CactusSpecies {
  id: string; // sp_0001 .. sp_1400
  index: number; // 1 .. 1400
  level: number; // 1 .. 14 (100 species per level)
  genus: string;
  species: string;
  scientificName: string;
  subfamily: 'Cactoideae' | 'Opuntioideae' | 'Pereskioideae' | 'Maihuenioideae';
  tribe: string;
  origin: string;
  growthForm: 'Globosa' | 'Columnar' | 'Cladodio (Opuntioide)' | 'Epífita' | 'Arbustiva / Foliar' | 'Geófita / Cespitosa';
}

interface GenusSeed {
  genus: string;
  subfamily: CactusSpecies['subfamily'];
  tribe: string;
  origin: string;
  growthForm: CactusSpecies['growthForm'];
  epithets: string[];
}

const GENUS_CATALOG: GenusSeed[] = [
  {
    genus: 'Mammillaria',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'México y Suroeste de EE. UU.',
    growthForm: 'Globosa',
    epithets: [
      'ahnii', 'albata', 'albicoma', 'albiflora', 'albilanata', 'albiarmata', 'amoena', 'anniana',
      'apozolensis', 'armillata', 'aureilanata', 'backebergiana', 'bambusiphila', 'baumii', 'beneckei',
      'berkiana', 'blossfeldiana', 'bocainsensis', 'bocasana', 'boelderliana', 'bombycina', 'boolii',
      'brachytrichion', 'brandeggeei', 'bulbispina', 'calacantha', 'camptotricha', 'candida', 'capensis',
      'carnea', 'carretii', 'celiae', 'centricirrha', 'cerralboa', 'chionocephala', 'coahuilensis',
      'columbiana', 'compressa', 'crinita', 'crucigera', 'decipiens', 'deherdtiana', 'densispina',
      'dioica', 'discolor', 'dixanthocentron', 'duoformis', 'ecchi', 'elongata', 'erectacantha',
      'erythrosperma', 'evermanniana', 'fittkaui', 'flavicentra', 'formosa', 'fraileana', 'gasseriana',
      'geminispina', 'gigantea', 'glassii', 'glochidiatum', 'goodridgei', 'gracilis', 'grahamii',
      'grusonii', 'guelzowiana', 'guerreronis', 'haageana', 'hahniana', 'heidiae', 'hemisphaerica',
      'herrerae', 'heyderi', 'huitzilopochtli', 'humboldtii', 'hutchisoniana', 'insularis', 'jaliscana',
      'johnstonii', 'karwinskiana', 'klissingiana', 'knippeliana', 'kraehenbuehlii', 'lasiacantha',
      'laui', 'lenta', 'leona', 'leucantha', 'longiflora', 'longimamma', 'luethyi', 'magallanii',
      'magnifica', 'magnimamma', 'mainiae', 'marksiana', 'matudae', 'mazatlanensis', 'melaleuca',
      'melanocentra', 'mercadensis', 'meyranii', 'microhelia', 'microthele', 'miegiana', 'moelleriana',
      'mystax', 'naimana', 'napina', 'nejapensis', 'neopalmeri', 'nivosa', 'nunezii', 'obconella',
      'orcuttii', 'oteroi', 'painteri', 'parkinsonii', 'pectinifera', 'pennispinosa', 'perbella',
      'petrophila', 'petterssonii', 'pilcayensis', 'pilispina', 'plumosa', 'polyedra', 'polythele',
      'pondii', 'poselgeri', 'pottsii', 'pringlei', 'prolifera', 'rekoi', 'rettigiana', 'rhodantha',
      'ritteriana', 'roseoalba', 'saboae', 'san-angelensis', 'sanchez-mejoradae', 'sartorii',
      'schiedeana', 'schumannii', 'schwartzii', 'sempervivi', 'senilis', 'sheldonii', 'solisioides',
      'sphacelata', 'spinosissima', 'standleyi', 'supertexta', 'surculosa', 'tayloriorum', 'theresae',
      'thornberi', 'tonalensis', 'uncinata', 'vetula', 'viperina', 'voburnensis', 'weingartiana',
      'wiesingeri', 'wildii', 'winterae', 'wrightii', 'xaltianguensis', 'zacatecasensis', 'zephyranthoides',
      'zeyeriana', 'zublerae'
    ]
  },
  {
    genus: 'Opuntia',
    subfamily: 'Opuntioideae',
    tribe: 'Opuntieae',
    origin: 'América (Canadá a Patagonia)',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'aciculata', 'ammophila', 'anacantha', 'atrispina', 'auberi', 'aurantiaca', 'aurea', 'basilaris',
      'boldinghii', 'brachyclada', 'Bravoana', 'cantabrigiensis', 'caracassana', 'chavena', 'chisosensis',
      'chlorotica', 'cochinera', 'cognata', 'curassavica', 'cymochila', 'deamii', 'decumbens',
      'dejecta', 'dillenii', 'echinocarpa', 'elatior', 'ellisiana', 'engelmannii', 'erinacea',
      'excelsa', 'ferox', 'ficus-indica', 'fragilis', 'fuliginosa', 'galapageia', 'gomei', 'gosseliniana',
      'guatemalensis', 'helleri', 'humifusa', 'hyptiacantha', 'inaequilateralis', 'inaperta', 'jaliscana',
      'joconostle', 'karwinskiana', 'laevis', 'lagunae', 'lasiacantha', 'leucotricha', 'lindheimeri',
      'littoralis', 'lutea', 'macrocentra', 'macrorhiza', 'megasperma', 'melanosperma', 'microdasys',
      'monacantha', 'nejapensis', 'nuda', 'orbiculata', 'orurensis', 'pachyrrhiza', 'parviclada',
      'phaeacantha', 'pilifera', 'pinkavae', 'polyacantha', 'pottsii', 'puberula', 'pubescens',
      'pusilla', 'pycnantha', 'pyriformis', 'quipa', 'quitensis', 'rastrera', 'repens', 'retrorsa',
      'robinsonii', 'robusta', 'rufida', 'salmiana', 'Sanguinea', 'santa-rita', 'scheeri', 'schickendantzii',
      'soederstromiana', 'spinulifera', 'stenopetala', 'streptacantha', 'stricta', 'strigil',
      'subulata', 'sulphurea', 'tapona', 'tehuacana', 'tehuantepecana', 'tomentosa', 'tortispina',
      'triacantha', 'tuna', 'turbinata', 'undulata', 'velutina', 'wilcoxii', 'zamudioi'
    ]
  },
  {
    genus: 'Echinopsis',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Sudamérica (Andes, Argentina, Bolivia, Perú)',
    growthForm: 'Columnar',
    epithets: [
      'ancistrophora', 'arachnacantha', 'aranea', 'arebaloi', 'atacamensis', 'aurea', 'backebergii',
      'bertramiana', 'boliviensis', 'boylei', 'bridgesii', 'bruceana', 'cabrerae', 'calochlora',
      'camarguensis', 'candicans', 'cephalomacrostibas', 'chalaensis', 'chamaecereus', 'chiloensis',
      'chrysochete', 'cinnabarina', 'clavata', 'cochabambensis', 'compacta', 'conaconensis',
      'cuzcoensis', 'densispina', 'deserticola', 'eyriesii', 'fabrisii', 'famatinensis', 'ferox',
      'formosa', 'friedrichii', 'glaucina', 'grandiflora', 'haematantha', 'hahniana', 'hamatacantha',
      'hertrichiana', 'huascha', 'hystrix', 'ibicuatensis', 'jajoiana', 'kermesina', 'klingleriana',
      'knuthiana', 'korethroides', 'lageniformis', 'lamprochlora', 'lateritia', 'leucantha', 'litoralis',
      'macrogona', 'mamillosa', 'marsoneri', 'mattiasii', 'maximilianii', 'meyeri', 'mieckleyi',
      'miniatiflora', 'mirabilis', 'molesta', 'multiplex', 'narvaecensis', 'nealeana', 'obrepanda',
      'oxygona', 'pachanoi', 'pamparuizii', 'pentlandii', 'peruviana', 'pojoensis', 'pseudocandicans',
      'pugionacantha', 'quadribarba', 'rhodotricha', 'rojasii', 'rowleyi', 'saltensis', 'santiaguensis',
      'schickendantzii', 'schieliana', 'scopulicola', 'shaferi', 'silvestrii', 'skottsbergii',
      'smrziana', 'spachiana', 'spinibarbis', 'strigosa', 'subdenudata', 'tacaquirensis', 'taratensis',
      'tarijensis', 'tegeleriana', 'terscheckii', 'thelegona', 'thelegonoides', 'tiegeliana',
      'trichosa', 'tubiflora', 'tunuianensis', 'uyupampensis', 'validus', 'vasquezii', 'volliana',
      'werdermanniana', 'yuquina'
    ]
  },
  {
    genus: 'Gymnocalycium',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Argentina, Bolivia, Paraguay, Uruguay y Brasil',
    growthForm: 'Globosa',
    epithets: [
      'achirasense', 'albiareolatum', 'ambatoense', 'amerhauseri', 'andreae', 'angelae', 'anisitsii',
      'baldii', 'baldianum', 'bayrianum', 'berchtii', 'bodenbenderianum', 'borthii', 'bruchii',
      'buenekeri', 'calochlorum', 'capillaense', 'carminanthum', 'castellanosii', 'catamarcense',
      'chacoense', 'chiquitanum', 'coatsii', 'curvispinum', 'damsii', 'deeszianum', 'denudatum',
      'erinaceum', 'esperanzae', 'eurypleurum', 'ferrarii', 'fischeri', 'fleischerianum', 'friedrichii',
      'gapoense', 'gibbosum', 'glaucum', 'guanchinense', 'horstii', 'hossei', 'hybopleurum',
      'hyptiacanthum', 'intertextum', 'kieslingii', 'kroenleinii', 'kurtzianum', 'leeanum', 'leptanthum',
      'lukasikii', 'marsoneri', 'maznetteri', 'megalothelos', 'mesopotamicum', 'ihanovichii',
      'mihanovichii', 'monvillei', 'mostii', 'multiflorum', 'nataliense', 'neuhuberi', 'nigriareolatum',
      'ochoterenae', 'occultum', 'odtonis', 'oenemae', 'paediophilum', 'paraguayense', 'parvulum',
      'pflanzii', 'platense', 'poeschlii', 'pugionacanthum', 'quehlianum', 'ragonesei', 'riojense',
      'riograndense', 'ritterianum', 'robustum', 'rosae', 'saglionis', 'schickendantzii', 'schroederianum',
      'spegazzinii', 'stellatum', 'stenopleurum', 'striglianum', 'stuckertii', 'taningaense',
      'terweemeanum', 'tillianum', 'triacanthum', 'uruguayense', 'valnicekianum', 'vatteri', 'weissianum'
    ]
  },
  {
    genus: 'Ferocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'México y Suroeste de EE. UU.',
    growthForm: 'Globosa',
    epithets: [
      'acanthodes', 'alamosanus', 'chrysacanthus', 'coloratus', 'covillei', 'cylindraceus', 'diguetii',
      'echidne', 'eastwoodiae', 'emoryi', 'flavovirens', 'fordii', 'gatesii', 'glaucescens', 'gracilis',
      'haematacanthus', 'hamatacanthus', 'herrerae', 'histrix', 'johnstonianus', 'latispinus',
      'lindsayi', 'macrodiscus', 'peninsulae', 'pilosus', 'pottsii', 'rectispinus', 'recurvus',
      'reppenhagenii', 'robustus', 'rostii', 'santa-maria', 'schwarzii', 'stainesii', 'tiburonensis',
      'townsendianus', 'viridescens', 'viscainensis', 'wislizeni'
    ]
  },
  {
    genus: 'Astrophytum',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Desierto Chihuahuense (México y Texas)',
    growthForm: 'Globosa',
    epithets: [
      'asterias', 'capricorne', 'caput-medusae', 'coahuilense', 'crassispinum', 'myriostigma',
      'iveum', 'ornatum', 'senile', 'tulense', 'columnare', 'glabrescens', 'nudum', 'quadricostatum',
      'tricostatum', 'virens'
    ]
  },
  {
    genus: 'Ariocarpus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Norte y Centro de México, Sur de Texas',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'agavoides', 'bravoanus', 'confusus', 'fissuratus', 'furfuraceus', 'hintonii', 'intermedius',
      'kotschoubeyanus', 'lloydii', 'retusus', 'scapharostrus', 'scaphirostris', 'trigonus', 'albiflorus',
      'elephantidens', 'macdowellii'
    ]
  },
  {
    genus: 'Turbinicarpus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Desierto Chihuahuense, México',
    growthForm: 'Globosa',
    epithets: [
      'alonsoi', 'andersonii', 'beguinii', 'bonatzii', 'booleanus', 'dickisoniae', 'flaviflorus',
      'gielsdorfianus', 'graminispinus', 'heliae', 'hoferi', 'horripilus', 'jauernigii', 'klinkerianus',
      'knuthianus', 'krainzianus', 'laui', 'lophophoroides', 'macrochele', 'mandragora', 'mombergeri',
      'nieblae', 'pailanus', 'pseudomacrochele', 'pseudopectinatus', 'rioverdensis', 'roseiflorus',
      'saueri', 'schmiedickeanus', 'schwarzii', 'subterraneus', 'swobodae', 'valdezianus', 'viereckii',
      'ysabelae', 'zaragozae'
    ]
  },
  {
    genus: 'Coryphantha',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'México y Suroeste de Norteamérica',
    growthForm: 'Globosa',
    epithets: [
      'andreae', 'asterias', 'bumamma', 'calipensis', 'clavata', 'compacta', 'cornifera', 'cuencamensis',
      'delaetiana', 'delicata', 'difficilis', 'durangensis', 'echinoidea', 'echinus', 'elephantidens',
      'erecta', 'georgii', 'glanduligera', 'glassii', 'gracilis', 'greenwoodii', 'hintoniorum',
      'indensis', 'jalpanensis', 'kracikii', 'laui', 'longicornis', 'macromeris', 'maiz-tablasensis',
      'melleospina', 'neglecta', 'nickelsiae', 'octacantha', 'ottonis', 'pallida', 'potosiana',
      'pseudoechinus', 'pseudonickelsiae', 'pulleineana', 'pycnacantha', 'radians', 'ramillosa',
      'recurvata', 'reduncuspina', 'retusa', 'robustispina', 'runyonii', 'salinensis', 'scheeri',
      'sulcata', 'tripugionacantha', 'vaupeliana', 'vogtherriana', 'werdermannii', 'wohlschlageri'
    ]
  },
  {
    genus: 'Echinocereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'México y Oeste de Estados Unidos',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'adiantus', 'amoenus', 'apachensis', 'arizonicus', 'baileyi', 'barthelowanus', 'berlandieri',
      'bonkerae', 'brandegeei', 'bristolii', 'chisoensis', 'chloranthus', 'cinerascens', 'coccineus',
      'ctenoides', 'dasyacanthus', 'davisii', 'delaetii', 'engelmannii', 'enneacanthus', 'fasciculatus',
      'fendleri', 'ferreirianus', 'fitchii', 'floresii', 'freudenbergeri', 'grandis', 'hancockii',
      'hempelii', 'hendricksonii', 'knippelianus', 'laui', 'ledermannii', 'leucanthus', 'lindsayi',
      'longisetus', 'mapimiensis', 'maritimus', 'marksianus', 'metornii', 'mombergerianus', 'nicholii',
      'nivosus', 'ortegae', 'pacifikus', 'palmeri', 'papillosus', 'parkeri', 'pectinatus', 'pensilis',
      'pentalophus', 'perbellus', 'polyacanthus', 'poselgeri', 'primolanatus', 'pseudopectinatus',
      'pulchellus', 'rayonesensis', 'reichenbachii', 'rigidissimus', 'roetteri', 'russanthus',
      'salm-dyckianus', 'scheeri', 'schereri', 'schmollii', 'sciurus', 'scopulorum', 'sharpii',
      'spinigemmatus', 'stollnitzii', 'stramineus', 'subinermis', 'tayopensis', 'triglochidiatus',
      'viereckii', 'viridiflorus', 'websterianus', 'weinbergii'
    ]
  },
  {
    genus: 'Melocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Caribe, México, Centroamérica y Norte de Sudamérica',
    growthForm: 'Globosa',
    epithets: [
      'acunae', 'amstutziae', 'andinus', 'azureus', 'bahiaensis', 'bellavistensis', 'braunii',
      'broadwayi', 'caroli-linnaei', 'concinnus', 'coniscoideus', 'curvispinus', 'deinacanthus',
      'ernestii', 'estevesii', 'ferreophilus', 'glaucescens', 'guitarti', 'harlowii', 'holguinensis',
      'intortus', 'lanssensianus', 'lemairei', 'levitestatus', 'macracanthos', 'matanzanus',
      'mazelianus', 'neryi', 'oreas', 'pachyacanthus', ' paucispinus', 'peruvianus', 'praerupticola',
      'rufispinus', 'salvador', 'schatzlii', 'smithii', 'stramineus', 'violaceus', 'zehntneri'
    ]
  },
  {
    genus: 'Parodia',
    subfamily: 'Cactoideae',
    tribe: 'Notocacteae',
    origin: 'Brasil, Paraguay, Uruguay, Argentina y Bolivia',
    growthForm: 'Globosa',
    epithets: [
      'alacriportana', 'allisonii', 'applanata', 'araneosa', 'arnostiana', 'aurescens', 'ayopayana',
      'buiningii', 'caespitosa', 'calvescens', 'camargensis', 'carambeiensis', 'chrysacanthion',
      'columnaris', 'commutans', 'concinnus', 'crassigibba', 'curvispina', 'erubescens', 'formosa',
      'fusca', 'gaucho', 'gibbulosa', 'graessneri', 'haselbergii', 'herteri', 'horsti', 'leninghausii',
      'linkii', 'maassii', 'magnifica', 'mammulosa', 'meonacantha', 'microsperma', 'mueller-melchersii',
      'muricata', 'neoarechavaletae', 'neobuenekeri', 'neochrysacanthion', 'neohorstii', 'nigrispina',
      'nivosa', 'nothorauschii', 'obtusa', 'occulta', 'ottonis', 'oxycostata', 'penicillata',
      'permagnifica', 'procera', 'rechensis', 'ritteriana', 'rudibuenekeri', 'rutilans', 'saint-pieana',
      'scopa', 'schumanniana', 'sellowii', 'stockingeri', 'submammulosa', 'subterranea', 'tabularis',
      'taratensis', 'tenuicylindrica', 'tildeae', 'tuberculata', 'turbinata', 'uebelmanniana',
      'warasii', 'werdermanniana'
    ]
  },
  {
    genus: 'Rebutia',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Andes de Bolivia y Noroeste de Argentina',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'albiflora', 'albipectinata', 'albopectinata', 'arenacea', 'aureiflora', 'breviflora', 'brunescens',
      'canigueralii', 'cardenasiana', 'chrysacantha', 'cintia', 'cylindrica', 'deminuta', 'einsteinii',
      'fabrisii', 'fiebrigii', 'flavistyla', 'fulviseta', 'gonjianii', 'heliosa', 'huasiensis',
      'krainziana', 'krugerae', 'leucanthema', 'marsoneri', 'mentosa', 'minuscula', 'mudanensis',
      'muscula', 'narvaecensis', 'neocumingii', 'nigricans', 'padcayensis', 'perplexa', 'pseudodeminuta',
      'pulchella', 'pulvinosa', 'pygmaea', 'rauschii', 'ritteri', 'robustispina', 'senilis',
      'simoniana', 'speggazziniana', 'steinbachii', 'steinmannii', 'tarvitaensis', 'tiraquensis',
      'tuberculata', 'violaciflora', 'vizcarrae', 'wessneriana', 'xanthocarpa'
    ]
  },
  {
    genus: 'Copiapoa',
    subfamily: 'Cactoideae',
    tribe: 'Notocacteae',
    origin: 'Desierto de Atacama, Chile',
    growthForm: 'Globosa',
    epithets: [
      'ahremephiana', 'alticostata', 'aphantha', 'atacamaensis', 'bridgesii', 'calderana', 'cinerascens',
      'cinerea', 'coquimbana', 'columna-alba', 'conglomerata', 'dealbata', 'decorticans', 'desertorum',
      'echinoides', 'esmeraldana', 'fiedleriana', 'gigantea', 'grandiflora', 'haseltoniana', 'humilis',
      'hypogaea', 'krainziana', 'laui', 'leonis', 'longistaminea', 'marginata', 'megarhiza', 'mollicula',
      'montana', 'paposoensis', 'pendulina', 'rupestris', 'serpentisulcata', 'solaris', 'tenuissima',
      'taltalensis', 'tocopillana', 'variispinata'
    ]
  },
  {
    genus: 'Eriosyce',
    subfamily: 'Cactoideae',
    tribe: 'Notocacteae',
    origin: 'Chile, Perú y Oeste de Argentina',
    growthForm: 'Globosa',
    epithets: [
      'aerocarpa', 'andreaeana', 'aspillagae', 'aurata', 'bulbocalyx', 'calderana', 'chilensis',
      'confinis', 'crispa', 'curvispina', 'engleri', 'esmeraldana', 'garaventae', 'heinrichiana',
      'islayensis', 'kunzei', 'laui', 'limariensis', 'marksiana', 'napina', 'occulta', 'odieri',
      'paucicostata', 'recondita', 'rodentiophila', 'senilis', 'simulans', 'sociabilis', 'strausiana',
      'subgibbosa', 'taltalensis', 'tenebrica', 'umadeave', 'villicumensis', 'villosus', 'wagenknechtii'
    ]
  },
  {
    genus: 'Rhipsalis',
    subfamily: 'Cactoideae',
    tribe: 'Rhipsalideae',
    origin: 'Bosques tropicales de América, África y Sri Lanka',
    growthForm: 'Epífita',
    epithets: [
      'agudoensis', 'baccifera', 'burchellii', 'campos-portoana', 'cereoides', 'cereuscula', 'clavata',
      'crispata', 'cuneata', 'dissimilis', 'elliptica', 'ewaldiana', 'floccosa', 'grandiflora',
      'hoelleri', 'houlletiana', 'juengeri', 'lindbergiana', 'mesembryanthemoides', 'micrantha',
      'neves-armondii', 'oblonga', 'occidentalis', 'olivifera', 'orMindensis', 'pachyptera',
      'paradoxa', 'pentaptera', 'pilocarpa', 'pulchra', 'puniceodiscus', 'russellii', 'sulcata',
      'teres', 'triangularis', 'trigona'
    ]
  },
  {
    genus: 'Epiphyllum',
    subfamily: 'Cactoideae',
    tribe: 'Hylocereeae',
    origin: 'México, Centroamérica y Sudamérica Tropical',
    growthForm: 'Epífita',
    epithets: [
      'anguliger', 'baueri', 'cartagense', 'chrysocardium', 'columbiense', 'costaricense', 'crenatum',
      'grandilobum', 'guatemalense', 'hookeri', 'laui', 'lepidocarpum', 'oxypetalum', 'phyllanthus',
      'pumilum', 'rubrocoronatum', 'thomasianum'
    ]
  },
  {
    genus: 'Selenicereus',
    subfamily: 'Cactoideae',
    tribe: 'Hylocereeae',
    origin: 'Mesoamérica, Caribe y Norte de Sudamérica',
    growthForm: 'Epífita',
    epithets: [
      'anthonyanus', 'atropilosus', 'boeckmannii', 'chontalensis', 'coniflorus', 'costaricensis',
      'donkelaarii', 'extensus', 'grandiflorus', 'hamatus', 'hondurensis', 'inermis', 'macdonaldiae',
      'megalanthus', 'monacanthus', 'murrillii', 'nelsonii', 'ocarpon', 'pteranthus', 'purpusii',
      'setaceus', 'spinulosus', 'stenopterus', 'tonduzii', 'triangularis', 'trigonus', 'undatus',
      'urbanianus', 'vagans', 'validus', 'wercklei'
    ]
  },
  {
    genus: 'Cereus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Sudamérica y Caribe',
    growthForm: 'Columnar',
    epithets: [
      'aethiops', 'albicaulis', 'bambusoides', 'bicolor', 'braunii', 'calcirupicola', 'cochabambensis',
      'comarapanus', 'estevesii', 'fernambucensis', 'forbesii', 'fricii', 'haageanus', 'hankeanus',
      'hexagonus', 'hildmannianus', 'horrispinus', 'huilunchu', 'insignis', 'jamacaru', 'kroenleinii',
      'lamprospermus', 'lanosus', 'lepidotus', 'mirabella', 'mortensenii', 'pachyrhizus', 'peruvianus',
      'phatnospermus', 'pierre-braunianus', 'repandus', 'roseiflorus', 'saddianus', 'spegazzinii',
      'stenogonus', 'tacuaralensis', 'trigonodendron', 'validus', 'vargasianus'
    ]
  },
  {
    genus: 'Pilosocereus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Brasil, México, Caribe y Norte de Sudamérica',
    growthForm: 'Columnar',
    epithets: [
      'albisummus', 'alensis', 'arrabidae', 'aureispinus', 'aurisetus', 'azulensis', 'bohlei',
      'brasiliensis', 'catingicola', 'chrysacanthus', 'chrysostele', 'collinsii', 'cristalinensis',
      'densilaniatus', 'diersianus', 'estevesii', 'flavipulvinatus', 'flexibilispinus', 'fulvilanatus',
      'gaumeri', 'glaucochrous', 'gounellei', 'guerreronis', 'januarensis', 'juruenensis', 'lanuginosus',
      'leucocephalus', 'machrisii', 'magnificus', 'multicostatus', 'oligolepis', 'pachycladus',
      'pentaedrophorus', 'piauhyensis', 'polygonus', 'purpusii', 'quadricentralis', 'royenii',
      'splendens', 'tuberculatus', 'vilaboensis', 'zahrae'
    ]
  },
  {
    genus: 'Pachycereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'México y Suroeste de EE. UU.',
    growthForm: 'Columnar',
    epithets: [
      'gatesii', 'gaumeri', 'grandis', 'hollianus', 'lepidanthus', 'marginatus', 'militaris',
      'pecten-aboriginum', 'pringlei', 'schottii', 'tehuantepecanus', 'weberi'
    ]
  },
  {
    genus: 'Stenocereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'México, Arizona, Centroamérica y Caribe',
    growthForm: 'Columnar',
    epithets: [
      'alool', 'aragonii', 'beneckei', 'chacalapensis', 'chrysocarpus', 'dumortieri', 'eichlamii',
      'eruca', 'fimbriatus', 'fricii', 'griseus', 'gummosus', 'heptagonus', 'humilis', 'kerberi',
      'laevigatus', 'martinezii', 'montanus', 'pruinosus', 'queretaroensis', 'quevedonis', 'standleyi',
      'stellatus', 'thurberi', 'treleasei', 'yunckeri', 'zopilotensis'
    ]
  },
  {
    genus: 'Cephalocereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Centro y Sur de México',
    growthForm: 'Columnar',
    epithets: [
      'apicephalium', 'columna-trajani', 'macrocephalus', 'nizandensis', 'senilis', 'totolapensis'
    ]
  },
  {
    genus: 'Cleistocactus',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Perú, Bolivia, Uruguay y Norte de Argentina',
    growthForm: 'Columnar',
    epithets: [
      'acanthocladus', 'ayopayanus', 'baumannii', 'buchtienii', 'Candelilla', 'chotaensis', 'clavispinus',
      'colademononis', 'fieldianus', 'flavispinus', 'grossei', 'hildegardiae', 'hyalacanthus',
      'ianthinus', 'icosagonus', 'jujuyensis', 'lancifer', 'longiserpens', 'luribayensis', 'morawetzianus',
      'orthogonus', 'parapetiensis', 'parviflorus', 'pecurius', 'plagiostoma', 'punoensis', 'reidleianus',
      'ritteri', 'roezlii', 'roseiflorus', 'samaipatanus', 'sepium', 'serpens', 'sextonianus',
      'smaragdiflorus', 'strausii', 'tenuiserpens', 'tomentosus', 'tupizensis', 'variispinus',
      'viridiflorus', 'winteri', 'xylorhizus'
    ]
  },
  {
    genus: 'Espostoa',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Andes de Perú y Sur de Ecuador',
    growthForm: 'Columnar',
    epithets: [
      'baumannii', 'blossfeldiorum', 'calva', 'crenata', 'frutescens', 'guentheri', 'huanucoensis',
      'hylaea', 'lanata', 'lanianuligera', 'melanostele', 'mirabilis', 'nana', 'ritteri', 'ruficeps',
      'senilis', 'superba', 'utcubambensis'
    ]
  },
  {
    genus: 'Oreocereus',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Altiplano Andino (Perú, Bolivia, Chile, Argentina)',
    growthForm: 'Columnar',
    epithets: [
      'celsianus', 'doelzianus', 'empusa', 'fossulatus', 'hempelianus', 'leucotrichus', 'pseudofossulatus',
      'ritteri', 'tacnaensis', 'trollii', 'varicolor'
    ]
  },
  {
    genus: 'Lophophora',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Desierto Chihuahuense (México y Sur de Texas)',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'alberto-vojtechii', 'diffusa', 'fricii', 'jourdaniana', 'koehresii', 'williamsii'
    ]
  },
  {
    genus: 'Pelecyphora',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'San Luis Potosí y Nuevo León, México',
    growthForm: 'Globosa',
    epithets: [
      'aselliformis', 'strobiliformis'
    ]
  },
  {
    genus: 'Strombocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Querétaro, Hidalgo y Guanajuato, México',
    growthForm: 'Globosa',
    epithets: [
      'corregidorae', 'disciformis', 'pulcherrimus'
    ]
  },
  {
    genus: 'Aztekium',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Nuevo León, México',
    growthForm: 'Globosa',
    epithets: [
      'hintonii', 'ritteri', 'valdezii'
    ]
  },
  {
    genus: 'Geohintonia',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Nuevo León, México',
    growthForm: 'Globosa',
    epithets: [
      'mexicana'
    ]
  },
  {
    genus: 'Obregonia',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Valle de Jaumave, Tamaulipas, México',
    growthForm: 'Globosa',
    epithets: [
      'denegrii'
    ]
  },
  {
    genus: 'Leuchtenbergia',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Desierto Chihuahuense, México',
    growthForm: 'Globosa',
    epithets: [
      'principis'
    ]
  },
  {
    genus: 'Epithelantha',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Noreste de México y Suroeste de EE. UU.',
    growthForm: 'Globosa',
    epithets: [
      'bokei', 'cryptica', 'greggii', 'icantha', 'micromeris', 'pachyrhiza', 'polycephala',
      'potosina', 'pulchra', 'spinosior', 'unguispina'
    ]
  },
  {
    genus: 'Escobaria',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Canadá, EE. UU., México y Cuba',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'abdita', 'albicolumnaria', 'alversonii', 'asperispina', 'bella', 'chihuahuensis', 'cubensis',
      'dasyacantha', 'desertii', 'duncanii', 'emskoetteriana', 'guadalupensis', 'hesteri', 'laredoi',
      'lloydii', 'minima', 'missouriensis', 'nellieae', 'neomexicana', 'organensis', 'orcuttii',
      'robbinsorum', 'roseana', 'runyonii', 'sandbergii', 'needii', 'sneedii', 'strobiliformis',
      'tuberculosa', 'villardii', 'vivipara', 'zilziana'
    ]
  },
  {
    genus: 'Thelocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Norte y Centro de México, Texas',
    growthForm: 'Globosa',
    epithets: [
      'bicolor', 'bolansis', 'buekii', 'conothelos', 'flavidispinus', 'garciae', 'hastifer',
      'hexaedrophorus', 'lausseri', 'leucacanthus', 'lloydii', 'macdowellii', 'matudae', 'multicephalus',
      'nidulans', 'panarottoanus', 'rinconensis', 'schwarzii', 'setispinus', 'tulensis'
    ]
  },
  {
    genus: 'Stenocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Norte y Centro de México',
    growthForm: 'Globosa',
    epithets: [
      'albatus', 'arrigens', 'bustamantei', 'caespitosus', 'confusus', 'coptonogonus', 'crispatus',
      'dichroacanthus', 'hastatus', 'heterochromus', 'lamellosus', 'lancifer', 'lloydii', 'multicostatus',
      'obvallatus', 'ochoterenaus', 'pentacanthus', 'phyllacanthus', 'rectispinus', 'sulphureus',
      'vaupelianus', 'wippermannii', 'zacatecasensis'
    ]
  },
  {
    genus: 'Sclerocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Suroeste de Estados Unidos',
    growthForm: 'Globosa',
    epithets: [
      'blainei', 'brevispinus', 'cloverae', 'contortus', 'erectocentrus', 'glaucus', 'havasupaiensis',
      'intertextus', 'johnsonii', 'mariposensis', 'mesae-verdae', 'nyensis', 'papyracanthus',
      'parviflorus', 'polyancistrus', 'pubispinus', 'scheeri', 'silvaticus', 'spinosa', 'terra-canyonae',
      'unguispinus', 'warnockii', 'wetlandicus', 'whipplei', 'wrightiae'
    ]
  },
  {
    genus: 'Pediocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'Oeste de Estados Unidos',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'bradyi', 'despainii', 'ermannii', 'knowltonii', 'nigrispinus', 'paradinei', 'peeblesianus',
      'sileri', 'simpsonii', 'winkleri'
    ]
  },
  {
    genus: 'Sulcorebutia',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Cordillera Oriental de Bolivia',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'alba', 'albissima', 'arenacea', 'augustinii', 'azurduyensis', 'breviflora', 'caineana',
      'camargoensis', 'candiae', 'canigueralii', 'cardenasiana', 'caracariensis', 'christiei',
      'clizensis', 'cochabambina', 'crispata', 'cylindrica', 'dorana', 'elizabethae', 'frankiana',
      'gemmae', 'glomeriseta', 'hoffmanniana', 'horrida', 'hertusii', 'juckeri', 'kamiensis',
      'krahnii', 'krugerae', 'langeri', 'lausekeri', 'losseuana', 'mariana', 'markusii', 'mentosa',
      'mizquensis', 'muschii', 'naunacaensis', 'ocarroliana', 'pasopayana', 'pedroensis', 'polymorpha',
      'purpurea', 'rauschii', 'roberto-vasquezii', 'santiaginiensis', 'steinbachii', 'swobodae',
      'tarabucoensis', 'taratensis', 'tiraquensis', 'totorensis', 'tunariensis', 'vargasii',
      'vasqueziana', 'verticillacantha', 'vizcarrae', 'zavaletae'
    ]
  },
  {
    genus: 'Lobivia',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Perú, Bolivia y Noroeste de Argentina',
    growthForm: 'Globosa',
    epithets: [
      'acanthoplegma', 'arachnacantha', 'atacamensis', 'aurea', 'backebergii', 'binghamiana',
      'bruchii', 'caineana', 'calorubra', 'cardenasiana', 'chionantha', 'chrysochete', 'cinnabarina',
      'corbula', 'crassicaulis', 'densispina', 'ducis-pauli', 'einsetinii', 'famatinensis', 'ferox',
      'formosa', 'grandiflora', 'haematantha', 'hertrichiana', 'jajoiana', 'krahn-juckeri', 'lateritia',
      'leptacantha', 'longispina', 'marsoneri', 'maximilianii', 'miniatiflora', 'nigrostoma',
      'oligotricha', 'pamparuizii', 'pentlandii', 'pojoensis', 'pugionacantha', 'quiabayensis',
      'rauschii', 'rossii', 'saltensis', 'sanguiniflora', 'schieliana', 'schreiteri', 'silvestrii',
      'steinmannii', 'tegeleriana', 'thionantha', 'tiegeliana', 'walteri', 'winteriana', 'wrightiana',
      'zecheri'
    ]
  },
  {
    genus: 'Matucana',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Andes del Perú',
    growthForm: 'Globosa',
    epithets: [
      'aurantiaca', 'aureiflora', 'blancii', 'celendinensis', 'comacephala', 'crinifera', 'currundayensis',
      'formosa', 'fruticosa', 'haynei', 'herzogiana', 'huagalensis', 'hystrix', 'intertexta',
      'krahnii', 'madisoniorum', 'myriacantha', 'oreodoxa', 'pallarensis', 'paucicostata', 'polzii',
      'pujupatii', 'ritteri', 'tuberculata', 'weberbaueri'
    ]
  },
  {
    genus: 'Oroya',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Andes Centrales del Perú',
    growthForm: 'Globosa',
    epithets: [
      'baumannii', 'borchersii', 'gibba', 'graessneri', 'laxiareolata', 'neoperuviana', 'peruviana',
      'subocculta'
    ]
  },
  {
    genus: 'Haageocereus',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Costa desértica del Perú y Norte de Chile',
    growthForm: 'Columnar',
    epithets: [
      'acranthus', 'albispinus', 'aureispinus', 'australis', 'chalaensis', 'chilensis', 'chrysacanthus',
      'decumbens', 'divaricatispinus', 'fascicularis', 'icosagonus', 'lanugispinus', 'limensis',
      'multangularis', 'pacalaensis', 'platinospinus', 'pseudomelanostele', 'pseudoversicolor',
      'repens', 'setosus', 'subtilispinus', 'tenuis', 'versicolor', 'vulpis-cauda', 'zehnederi'
    ]
  },
  {
    genus: 'Browningia',
    subfamily: 'Cactoideae',
    tribe: 'Browningieae',
    origin: 'Perú, Bolivia y Norte de Chile',
    growthForm: 'Columnar',
    epithets: [
      'altissima', 'amstutziae', 'caineana', 'candelaris', 'chlorocarpa', 'columnaris', 'hertlingiana',
      'microsperma', 'pilleifera', 'riosaniensis', 'viridis'
    ]
  },
  {
    genus: 'Disocactus',
    subfamily: 'Cactoideae',
    tribe: 'Hylocereeae',
    origin: 'México y América Central',
    growthForm: 'Epífita',
    epithets: [
      'ackermannii', 'aurantiacus', 'biformis', 'cinnabarinus', 'crassu', 'eichlamii', 'flagelliformis',
      'kimnachii', 'loddigesii', 'macranthus', 'martianus', 'nelsonii', 'phyllanthoides', 'quezaltecus',
      'salvadorensis', 'speciosus'
    ]
  },
  {
    genus: 'Schlumbergera',
    subfamily: 'Cactoideae',
    tribe: 'Rhipsalideae',
    origin: 'Bosques costeros del Sureste de Brasil',
    growthForm: 'Epífita',
    epithets: [
      'buckleyi', 'catingicola', 'exotica', 'kautskyi', 'lutea', 'microsphaerica', 'opuntioides',
      'orssichiana', 'reginae', 'russelliana', 'truncata'
    ]
  },
  {
    genus: 'Hatiora',
    subfamily: 'Cactoideae',
    tribe: 'Rhipsalideae',
    origin: 'Mata Atlántica del Sureste de Brasil',
    growthForm: 'Epífita',
    epithets: [
      'cylindrica', 'epiphylloides', 'gaertneri', 'graeseri', 'herminiae', 'pentaptera', 'rosea',
      'salicornioides'
    ]
  },
  {
    genus: 'Lepismium',
    subfamily: 'Cactoideae',
    tribe: 'Rhipsalideae',
    origin: 'Sudamérica Oriental y Andina',
    growthForm: 'Epífita',
    epithets: [
      'aculeatum', 'bolivianum', 'brevispinum', 'crenatum', 'cruciforme', 'floccosum', 'houlletianum',
      'ianthothele', 'incachacanum', 'lorentzianum', 'lumbricoides', 'micranthum', 'miyasakii',
      'monacanthum', 'paranganiense', 'warmingianum'
    ]
  },
  {
    genus: 'Pereskia',
    subfamily: 'Pereskioideae',
    tribe: 'Pereskieae',
    origin: 'Mesoamérica, Caribe y Sudamérica Tropical',
    growthForm: 'Arbustiva / Foliar',
    epithets: [
      'aculeata', 'aureiflora', 'bahiaensis', 'bleo', 'conzattii', 'diaz-romeroana', 'godseffiana',
      'grandifolia', 'guamacho', 'horrida', 'humboldtii', 'lychnidiflora', 'marcanoi', 'nemorosa',
      'portulacifolia', 'quisqueyana', 'sacharosa', 'stenantha', 'weberiana', 'zinniiflora'
    ]
  },
  {
    genus: 'Maihuenia',
    subfamily: 'Maihuenioideae',
    tribe: 'Maihuenieae',
    origin: 'Patagonia y Andes Australes (Chile y Argentina)',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'patagonica', 'poeppigii'
    ]
  },
  {
    genus: 'Cylindropuntia',
    subfamily: 'Opuntioideae',
    tribe: 'Cylindropuntieae',
    origin: 'Norte de México y Suroeste de Estados Unidos',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'abyssi', 'acanthocarpa', 'alcahes', 'anteojoensis', 'arbuscula', 'bigelovii', 'californica',
      'calmalliensis', 'caribaea', 'chuckwallensis', 'cholla', 'clavata', 'congdonii', 'davisii',
      'delgadilloana', 'echinocarpa', 'fosbergii', 'fulgida', 'ganderi', 'imbricata', 'kleiniae',
      'leptocaulis', 'lindsayi', 'molesta', 'munzii', 'parishii', 'prolifera', 'ramosissima',
      'rosei', 'sanfelipensis', 'santamaria', 'spinorior', 'spinosior', 'tesajo', 'thurberi',
      'tunicata', 'versicolor', 'whipplei', 'wolfii'
    ]
  },
  {
    genus: 'Tephrocactus',
    subfamily: 'Opuntioideae',
    tribe: 'Tephrocacteae',
    origin: 'Oeste de Argentina y Chile',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'alexanderi', 'aoracanthus', 'articulatus', 'bonnieae', 'curvispinus', 'diadematus', 'geometricus',
      'halophilus', 'inermis', 'molinensis', 'nigrispinus', 'ovatus', 'paediophilus', 'papyracanthus',
      'recurvatus', 'strobiliformis', 'verschaffeltii', 'weberi'
    ]
  },
  {
    genus: 'Maihueniopsis',
    subfamily: 'Opuntioideae',
    tribe: 'Tephrocacteae',
    origin: 'Andes de Argentina, Chile, Bolivia y Perú',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'archiconoidea', 'atacamaensis', 'boliviana', 'camachoi', 'clavarioides', 'colorea', 'connoidea',
      'crassispina', 'darwinii', 'domeykoensis', 'glomerata', 'grandiflora', 'hypogaea', 'leoncito',
      'minuta', 'molfinoi', 'nigrispina', 'ovata', 'pentlandii', 'rahmeri', 'subterranea', 'tarapacana',
      'wagenknechtii'
    ]
  },
  {
    genus: 'Cumulopuntia',
    subfamily: 'Opuntioideae',
    tribe: 'Tephrocacteae',
    origin: 'Perú, Bolivia, Norte de Chile y Argentina',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'boliviana', 'chichensis', 'corotilla', 'crassicylindrica', 'dactylifera', 'echinacea',
      'frigida', 'fulvicoma', 'galerasensis', 'hystricina', 'ignescens', 'iturbicola', 'leucophaea',
      'mistiensis', 'pentlandii', 'pyrrhacantha', 'rossiana', 'sphaerica', 'ticnamarensis',
      'tumida', 'unguispina', 'zebrina'
    ]
  },
  {
    genus: 'Puna',
    subfamily: 'Opuntioideae',
    tribe: 'Tephrocacteae',
    origin: 'Puna de Argentina y Bolivia',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'bonnieae', 'clavarioides', 'subterranea'
    ]
  },
  {
    genus: 'Pterocactus',
    subfamily: 'Opuntioideae',
    tribe: 'Pterocacteae',
    origin: 'Sur y Oeste de Argentina',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'araucanus', 'australis', 'fischeri', 'gonjianii', 'hickenii', 'kuntzei', 'megliolii',
      'neuquensis', 'reticulatus', 'tuberosus', 'valentinii'
    ]
  },
  {
    genus: 'Grusonia',
    subfamily: 'Opuntioideae',
    tribe: 'Cylindropuntieae',
    origin: 'Desierto Chihuahuense y Sonorense',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'aggeria', 'bradtiana', 'bulbispina', 'clavata', 'dumetorum', 'emoryi', 'grahamii', 'invicta',
      'kunzei', 'marenae', 'moelleri', 'parishii', 'pulchella', 'reflexispina', 'robertsii',
      'schottii', 'stanlyi', 'vilis'
    ]
  },
  {
    genus: 'Carnegiea',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Desierto de Sonora (Arizona y Sonora)',
    growthForm: 'Columnar',
    epithets: [
      'gigantea'
    ]
  },
  {
    genus: 'Myrtillocactus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'México y Guatemala',
    growthForm: 'Columnar',
    epithets: [
      'cochal', 'eichlamii', 'geometrizans', 'schenckii'
    ]
  },
  {
    genus: 'Lophocereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Noroeste de México y Sur de Arizona',
    growthForm: 'Columnar',
    epithets: [
      'gatesii', 'marginatus', 'schottii'
    ]
  },
  {
    genus: 'Polaskia',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Puebla y Oaxaca, México',
    growthForm: 'Columnar',
    epithets: [
      'chende', 'chichipe'
    ]
  },
  {
    genus: 'Isolatocereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Centro y Sur de México',
    growthForm: 'Columnar',
    epithets: [
      'dumortieri'
    ]
  },
  {
    genus: 'Escontria',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Sur de México (Puebla, Oaxaca, Guerrero)',
    growthForm: 'Columnar',
    epithets: [
      'chiotilla'
    ]
  },
  {
    genus: 'Neobuxbaumia',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Este y Sur de México',
    growthForm: 'Columnar',
    epithets: [
      ' euphorbioides', 'laui', 'macrocephala', 'mezcalaensis', 'multiareolata', 'polylopha',
      'sanfelipensis', 'squamulosa', 'tetetzo'
    ]
  },
  {
    genus: 'Peniocereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Suroeste de EE. UU., México y Centroamérica',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'castellanosii', 'cuixmalensis', 'fosterianus', 'greggii', 'hirschtianus', 'johnstonii',
      'lazaro-cardenasii', 'macdougallii', 'maculatus', 'marianus', 'occidentalis', 'oaxacensis',
      'papillosus', 'rosei', 'serpentinus', 'striatus', 'tepalcatepecanus', 'viperinus', 'zopilotensis'
    ]
  },
  {
    genus: 'Acanthocereus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'América Tropical y Caribe',
    growthForm: 'Columnar',
    epithets: [
      'baxaniensis', 'chiapensis', 'colombianus', 'horridus', 'occidentalis', 'subinermis', 'tetragonus'
    ]
  },
  {
    genus: 'Bergerocactus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'California y Baja California',
    growthForm: 'Columnar',
    epithets: [
      'emoryi'
    ]
  },
  {
    genus: 'Echinocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cacteae',
    origin: 'México y Suroeste de Estados Unidos',
    growthForm: 'Globosa',
    epithets: [
      'grusonii', 'horizonthalonius', 'parryi', 'platyacanthus', 'polycephalus', 'texensis'
    ]
  },
  {
    genus: 'Hylocereus',
    subfamily: 'Cactoideae',
    tribe: 'Hylocereeae',
    origin: 'México, Centroamérica y Norte de Sudamérica',
    growthForm: 'Epífita',
    epithets: [
      'calcaratus', 'costaricensis', 'escuintlensis', 'guatemalensis', 'lemairei', 'megalanthus',
      'minutiflorus', 'monacanthus', 'ocarpon', 'polyrhizus', 'purpusii', 'stenopterus', 'triangularis',
      'trigonus', 'undatus'
    ]
  },
  {
    genus: 'Weberocereus',
    subfamily: 'Cactoideae',
    tribe: 'Hylocereeae',
    origin: 'Costa Rica, Panamá y Ecuador',
    growthForm: 'Epífita',
    epithets: [
      'biolleyi', 'bradei', 'frohningiorum', 'glaber', 'imitans', 'panamensis', 'rosei', 'tonduzii',
      'trichophorus', 'tunilla'
    ]
  },
  {
    genus: 'Pseudorhipsalis',
    subfamily: 'Cactoideae',
    tribe: 'Hylocereeae',
    origin: 'Mesoamérica y Jamaica',
    growthForm: 'Epífita',
    epithets: [
      'acuminata', 'alata', 'himantoclada', 'horichii', 'lankesteri', 'ramulosa'
    ]
  },
  {
    genus: 'Aporocactus',
    subfamily: 'Cactoideae',
    tribe: 'Hylocereeae',
    origin: 'Hidalgo, Oaxaca y Veracruz, México',
    growthForm: 'Epífita',
    epithets: [
      'conzattii', 'flagelliformis', 'flagriformis', 'leptophis', 'martianus'
    ]
  },
  {
    genus: 'Discocactus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Brasil, Este de Bolivia y Norte de Paraguay',
    growthForm: 'Globosa',
    epithets: [
      'albispinus', 'araneispinus', 'bahiaensis', 'boliviensis', 'buenekeri', 'catingicola',
      'cephalieri', 'crystallophilus', 'diersianus', 'estevesii', 'ferricola', 'hartmannii',
      'heptacanthus', 'horstii', 'insignis', 'latispinus', 'lindanus', 'magnimammus', 'multicolorispinus',
      'pachythele', 'petr-halfarii', 'placentiformis', 'pseudoinsignis', 'pugionacanthus', 'silicicola',
      'subviridigriseus', 'woehrmannianus', 'zehntneri'
    ]
  },
  {
    genus: 'Uebelmannia',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Minas Gerais, Brasil',
    growthForm: 'Globosa',
    epithets: [
      'ammikai', 'buiningii', 'flavispina', 'gummifera', 'meninae', 'pectinifera'
    ]
  },
  {
    genus: 'Arrojadoa',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Bahía y Minas Gerais, Brasil',
    growthForm: 'Columnar',
    epithets: [
      'albiflora', 'bahiaensis', 'beateae', 'canudosensis', 'dinae', 'eriocaulis', 'heimenii',
      'horstiana', 'marylanae', 'multiflora', 'penicillata', 'rhodatha', 'rhodantha'
    ]
  },
  {
    genus: 'Micranthocereus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Este y Centro de Brasil',
    growthForm: 'Columnar',
    epithets: [
      'albicephalus', 'auriazureus', 'dolichospermaticus', 'estevesii', 'flaviflorus', 'hofackerianus',
      'monteazulensis', 'polyacanthus', 'polyanthus', 'purpureus', 'streckerii', 'violaciflorus'
    ]
  },
  {
    genus: 'Coleocephalocereus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Este de Brasil (Mata Atlántica y Caatinga)',
    growthForm: 'Columnar',
    epithets: [
      'aureus', 'braunii', 'buxbaumianus', 'decumbens', 'diersianus', 'estevesii', 'fluminensis',
      'goebelianus', 'pluricostatus', 'purpureus', 'ullensteinianus'
    ]
  },
  {
    genus: 'Stephanocereus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Bahía, Brasil',
    growthForm: 'Columnar',
    epithets: [
      'leucostele', 'luetzelburgii'
    ]
  },
  {
    genus: 'Cipocereus',
    subfamily: 'Cactoideae',
    tribe: 'Cereeae',
    origin: 'Serra do Cipó, Minas Gerais, Brasil',
    growthForm: 'Columnar',
    epithets: [
      'bradei', 'crassisepalus', 'laniflorus', 'minensis', 'pleurocarpus', 'pusilliflorus'
    ]
  },
  {
    genus: 'Frailea',
    subfamily: 'Cactoideae',
    tribe: 'Notocacteae',
    origin: 'Brasil, Uruguay, Paraguay, Argentina y Bolivia',
    growthForm: 'Globosa',
    epithets: [
      'albicolumnaris', 'albiareolata', 'alexandri', 'asterioides', 'buenekeri', 'castanea',
      'cataphracta', 'chiquitana', 'concepcionensis', 'curvispina', 'deminuta', 'friedrichii',
      'fulviseta', 'gracillima', 'grahliana', 'horstii', 'knippeliana', 'lepida', 'mammifera',
      'moseriana', 'perumbilicata', 'phaeodisca', 'pigmaea', 'pumila', 'pygmaea', 'schilinzkyana',
      'stockingeri'
    ]
  },
  {
    genus: 'Blossfeldia',
    subfamily: 'Cactoideae',
    tribe: 'Blossfeldieae',
    origin: 'Andes Orientales de Bolivia y Argentina',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'atroviridis', 'campaniflora', 'cyathiformis', 'fechseri', 'floccosa', 'liliputana', 'minima',
      'pedicellata', 'subterranea', 'tarijensis'
    ]
  },
  {
    genus: 'Cintia',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Cinti, Chuquisaca, Bolivia',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'knizei'
    ]
  },
  {
    genus: 'Weingartia',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Bolivia y Noroeste de Argentina',
    growthForm: 'Globosa',
    epithets: [
      'ambigua', 'attenuata', 'buiningiana', 'cintiensis', 'corroana', 'erinnacea', 'fidaiana',
      'flavida', 'hediniana', 'kargliana', 'knizei', 'lanata', 'lecoriensis', 'longigibba',
      'multispina', 'neocumingii', 'neumanniana', 'oligacantha', 'pilcomayensis', 'platygona',
      'pruinosa', 'pulquinensis', 'riograndensis', 'sucrensis', 'trollii', 'vilcayensis', 'vorwerkii',
      'westii'
    ]
  },
  {
    genus: 'Acanthocalycium',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Noroeste de Argentina',
    growthForm: 'Globosa',
    epithets: [
      'aurantiacum', 'brevispinum', 'catamarcense', 'chionanthum', 'ferrarii', 'glaucum', 'griseum',
      'klimpelianum', 'peitscherianum', 'spiniflorum', 'thionanthum', 'variiflorum', 'violaceum'
    ]
  },
  {
    genus: 'Denmoza',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Oeste y Noroeste de Argentina',
    growthForm: 'Globosa',
    epithets: [
      'erythrocephala', 'rhodacantha'
    ]
  },
  {
    genus: 'Mila',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Andes Occidentales del Perú',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'albisaetacens', 'breviseta', 'caespitosa', 'cereoides', 'colerea', 'densiseta', 'fortalezensis',
      'kubeana', 'lurinensis', 'nealeana', 'pugionifera'
    ]
  },
  {
    genus: 'Pygmaeocereus',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Lomas Costeras del Perú',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'akresii', 'bieblii', 'bylesianus', 'familiaris', 'rowleyanus'
    ]
  },
  {
    genus: 'Arthrocereus',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Minas Gerais y Mato Grosso, Brasil',
    growthForm: 'Columnar',
    epithets: [
      'campinensis', 'glaziovii', 'itabiritoensis', 'melanurus', 'odorus', 'rondonianus', 'spinosissimus'
    ]
  },
  {
    genus: 'Harrisia',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Florida, Caribe, Brasil, Paraguay, Bolivia y Argentina',
    growthForm: 'Columnar',
    epithets: [
      'aboriginum', 'adscendens', 'balancei', 'bonplandii', 'brookii', 'divaricata', 'earlei',
      'eriophora', 'fernowii', 'fragrantissima', 'gracilis', 'hururn', 'martinii', 'nashii',
      'pomanensis', 'portoricensis', 'regelli', 'simpsonii', 'taetra', 'taylori', 'tetrantha',
      'tortuosa'
    ]
  },
  {
    genus: 'Weberbauerocereus',
    subfamily: 'Cactoideae',
    tribe: 'Trichocereeae',
    origin: 'Perú y Norte de Chile',
    growthForm: 'Columnar',
    epithets: [
      'albus', 'cephalomacrostibas', 'churinensis', 'cuzcoensis', 'fasciatus', 'johnsonii',
      'longicomus', 'madidiensis', 'rauhii', 'seyboldianus', 'winterianus'
    ]
  },
  {
    genus: 'consolea',
    subfamily: 'Opuntioideae',
    tribe: 'Opuntieae',
    origin: 'Caribe y Florida',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'corallicola', 'falcata', 'macracantha', 'millspaughii', 'moniliformis', 'nashii', 'picardae',
      'rubescens', 'spinossissima', 'urbaniana'
    ]
  },
  {
    genus: 'Brasiliopuntia',
    subfamily: 'Opuntioideae',
    tribe: 'Opuntieae',
    origin: 'Brasil, Perú, Bolivia, Paraguay y Argentina',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'brasiliensis', 'neoargentina', 'schomburgkii', 'subacarpa'
    ]
  },
  {
    genus: 'Tacinga',
    subfamily: 'Opuntioideae',
    tribe: 'Opuntieae',
    origin: 'Caatinga del Noreste de Brasil',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'atroviridis', 'braunii', 'estevesii', 'funalis', 'inamoena', 'lilae', 'palmadora', 'saxatilis',
      'subcylindrica', 'werneri'
    ]
  },
  {
    genus: 'Nopalea',
    subfamily: 'Opuntioideae',
    tribe: 'Opuntieae',
    origin: 'México y Centroamérica',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'auberi', 'cochenillifera', 'dejecta', 'gaumeri', 'inaperta', 'karwinskiana', 'lutea', 'nuda'
    ]
  },
  {
    genus: 'Austrocylindropuntia',
    subfamily: 'Opuntioideae',
    tribe: 'Austrocylindropuntieae',
    origin: 'Andes de Ecuador, Perú, Bolivia y Argentina',
    growthForm: 'Cladodio (Opuntioide)',
    epithets: [
      'cylindrica', 'floccosa', 'hirschii', 'lagopus', 'macha', 'pachypus', 'punta-caillan',
      'shaferi', 'subulata', 'verschaffeltii', 'vestita', 'yangambensis'
    ]
  },
  {
    genus: 'Corynopuntia',
    subfamily: 'Opuntioideae',
    tribe: 'Cylindropuntieae',
    origin: 'Suroeste de EE. UU. y Norte de México',
    growthForm: 'Geófita / Cespitosa',
    epithets: [
      'aggeria', 'bulbispina', 'clavata', 'dumetorum', 'emoryi', 'grahamii', 'invicta', 'kunzei',
      'marenae', 'moelleri', 'parishii', 'pulchella', 'reflexispina', 'robertsii', 'schottii',
      'stanlyi', 'vilis'
    ]
  },
  {
    genus: 'Pereskiopsis',
    subfamily: 'Opuntioideae',
    tribe: 'Cylindropuntieae',
    origin: 'México y Guatemala',
    growthForm: 'Arbustiva / Foliar',
    epithets: [
      'aquosa', 'kellermanii', 'diguetii', 'gatesii', 'porteri', 'rotundifolia', 'spathulata', 'velutina'
    ]
  },
  {
    genus: 'Quiabentia',
    subfamily: 'Opuntioideae',
    tribe: 'Cylindropuntieae',
    origin: 'Gran Chaco y Caatinga de Sudamérica',
    growthForm: 'Arbustiva / Foliar',
    epithets: [
      'verticillata', 'zehntneri'
    ]
  },
  {
    genus: 'Eulychnia',
    subfamily: 'Cactoideae',
    tribe: 'Notocacteae',
    origin: 'Costa desértica de Chile y Sur de Perú',
    growthForm: 'Columnar',
    epithets: [
      'acida', 'breviflora', 'castanea', 'chorosensis', 'elata', 'iquiquensis', 'morromorenoensis',
      'ritteri', 'saint-pieana', 'taltalensis', 'vallenarensis'
    ]
  },
  {
    genus: 'Corryocactus',
    subfamily: 'Cactoideae',
    tribe: 'Pachycereeae',
    origin: 'Perú, Bolivia y Norte de Chile',
    growthForm: 'Columnar',
    epithets: [
      'apurense', 'aureus', 'ayacuchoensis', 'aysenensis', 'brachypetalus', 'brevistylus',
      'chachapoyensis', 'charazanensis', 'chavinilloensis', 'erectus', 'melanotrichus', 'otuyensis',
      'pulquinensis', 'quadrangularis', 'squarrosus', 'tarijensis'
    ]
  },
  {
    genus: 'Neoraimondia',
    subfamily: 'Cactoideae',
    tribe: 'Browningieae',
    origin: 'Perú y Bolivia',
    growthForm: 'Columnar',
    epithets: [
      'arequipensis', 'herzogiana', 'macrostibas', 'peruviana', 'roseiflora'
    ]
  },
  {
    genus: 'Armatocereus',
    subfamily: 'Cactoideae',
    tribe: 'Browningieae',
    origin: 'Ecuador y Perú',
    growthForm: 'Columnar',
    epithets: [
      'brevispinus', 'cartwrightianus', 'ghiesbreghtii', 'godingianus', 'humilis', 'laetus',
      'mataranus', 'matucanensis', 'oligogonus', 'procerus', 'ankaiensis', 'rauhoii', 'riomajensis',
      'rupicola'
    ]
  },
  {
    genus: 'Calymmanthium',
    subfamily: 'Cactoideae',
    tribe: 'Calymmanthieae',
    origin: 'Norte del Perú (Cajamarca y Amazonas)',
    growthForm: 'Columnar',
    epithets: [
      'fertile', 'substerile'
    ]
  },
  {
    genus: 'Leuenbergeria',
    subfamily: 'Pereskioideae',
    tribe: 'Pereskieae',
    origin: 'Caribe, México y Norte de Sudamérica',
    growthForm: 'Arbustiva / Foliar',
    epithets: [
      'aureiflora', 'bleo', 'guamacho', 'lychnidiflora', 'marcanoi', 'portulacifolia', 'quisqueyana',
      'zinniiflora'
    ]
  }
];

function capitalizeFirst(str: string): string {
  const trimmed = str.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function buildAll1400CactusSpecies(): CactusSpecies[] {
  const list: CactusSpecies[] = [];
  const seenNames = new Set<string>();

  for (const seed of GENUS_CATALOG) {
    const genusClean = capitalizeFirst(seed.genus);
    for (const rawEpithet of seed.epithets) {
      const epithetClean = rawEpithet.trim().toLowerCase();
      if (!epithetClean) continue;
      const scientificName = `${genusClean} ${epithetClean}`;
      if (seenNames.has(scientificName)) continue;
      seenNames.add(scientificName);

      const idx = list.length + 1;
      if (idx > 1400) break;

      list.push({
        id: `sp_${String(idx).padStart(4, '0')}`,
        index: idx,
        level: Math.ceil(idx / 100),
        genus: genusClean,
        species: epithetClean,
        scientificName,
        subfamily: seed.subfamily,
        tribe: seed.tribe,
        origin: seed.origin,
        growthForm: seed.growthForm,
      });
    }
    if (list.length >= 1400) break;
  }

  return list.slice(0, 1400);
}

export const ALL_CACTUS_SPECIES: CactusSpecies[] = buildAll1400CactusSpecies();

export const TOTAL_LEVELS = 14;
export const SPECIES_PER_LEVEL = 100;

export function getSpeciesForLevel(level: number): CactusSpecies[] {
  if (level === 0) return ALL_CACTUS_SPECIES; // 0 = Todas las 1400 especies
  const start = (level - 1) * SPECIES_PER_LEVEL;
  return ALL_CACTUS_SPECIES.slice(start, start + SPECIES_PER_LEVEL);
}
