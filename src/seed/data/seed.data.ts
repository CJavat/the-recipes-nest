type UserRole = 'ADMIN' | 'USER';

interface SeedUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface SeedRecipe {
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  categoryId?: string;
}

interface SeedCategory {
  name: string;
}

interface SeedData {
  users: SeedUser[];
  recipes: SeedRecipe[];
  categories: SeedCategory[];
}

export const initialData: SeedData = {
  users: [
    {
      firstName: 'CJavatX',
      lastName: 'Administrator',
      email: 'cjavatx@gmail.com',
      password: '123456',
      role: 'ADMIN',
    },
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@gmail.com',
      password: '123456',
      role: 'USER',
    },
    {
      firstName: 'Daniel',
      lastName: 'Plascencia',
      email: 'daniel@gmail.com',
      password: '123456',
      role: 'USER',
    },
    {
      firstName: 'Carlos',
      lastName: 'Mercado',
      email: 'carlos@gmail.com',
      password: '123456',
      role: 'USER',
    },
    {
      firstName: 'Javat',
      lastName: 'Ibarra',
      email: 'javat@gmail.com',
      password: '123456',
      role: 'USER',
    },
    {
      firstName: 'Isabel',
      lastName: 'Gallegos',
      email: '020902isa@gmail.com',
      password: '123456',
      role: 'USER',
    },
  ],
  recipes: [
    {
      title: 'Pasta BLT',
      description:
        'Esta receta de pasta BLT está inspirada en el famoso sándwich de tocino, lechuga y jitomate. Como puedes ver, esta pasta combina una gran variedad de sabores y texturas, lo que la hace única e irresistible. ¿Te animas a probar esta pasta BLT?',
      ingredients: [
        'Agua',
        'Sal',
        '1 Paquete de Sopa de Señas',
        '1/2 Mayonesa',
        '1/2 tazas de crema ácida',
        '1 Cucharada de leche',
      ],
      steps: [
        'Añade la Sopa de señas La Moderna® en una olla con agua hirviendo y sal. Cocina durante 5 minutos, escurre y reserva.',
        'En un bowl, combina la mayonesa, la crema ácida, la leche, el perejil, el cilantro, la cebolla en polvo, el ajo en polvo, la sal, la pimienta y el jugo de limón. Mezcla hasta integrar y reserva.',
        'Coloca una cama de lechuga en una ensaladera, agrega los tomates cherry y el tocino y mezcla hasta integrar. Incorpora la pasta y mezcla.',
        'Sirve la ensalada BLT y acompaña con el aderezo y una bebida refrescante.',
      ],
      image: 'pastablt.jpg',
    },
    {
      title: 'Pasta con chipotle, aguacate y mango',
      description:
        'La pasta, uno de los alimentos más versátiles que existen en el mundo, puede servirse con salsa de tomate, albóndigas, salsa Alfredo, verduras o proteínas. También puede servirse como ensalada fría o caliente, así que lo único que debes hacer, es elegir una de nuestras recetas para preparar una comida familiar.',
      ingredients: [
        'Agua',
        'Sal',
        '1 Paquete de Sopa de Rotini de Luigi',
        '1/2 de aceite de oliva',
        '1/2 tazas de vinagre',
        '3 cucharadas de miel',
        '1 de ajo en polvo',
      ],
      steps: [
        'Hierve el agua con sal en una olla, agrega la pasta Rotini De Luigi® y cocina durante 9 minutos o hasta que esté bien cocida. Escurre y reserva.',
        'Para el aderezo: en un bowl, mezcla el aceite de oliva, el vinagre de vino tinto, la miel, el jugo de limón, los chiles chipotles, el ajo en polvo, el orégano, el comino, la sal y la pimienta cono un batidor de globo hasta que el aderezo esté bien integrado. Reserva.',
        'Mezcla los granos de elote, los jitomates cherry, los pepinos persas, el aguacate, el mango, la menta y la pasta Rotini De Luigi® en un bowl. Sirve la pasta con chipotle, aguacate y mango en una ensaladera y acompaña con el aderezo.',
      ],
      image: 'pasta-con-chipotle-aguacate-y-mango.jpg',
    },
    {
      title: 'Pasta de Crema de Champiñones',
      description:
        'Como sabemos lo mucho que te gusta la pasta, te presentamos una deliciosa receta de pasta de crema con champiñones. Es una preparación cremosa, y con un toque picosito que te encantará.',
      ingredients: [
        '20 champiñones',
        '250g de jamón picado',
        '100g de queso chihuahua',
        '1 taza de crema',
        '1/2 taza de cebolla',
        '3 cucharadas de prejil',
        '500g de pasta',
      ],
      steps: [
        'Cocer la pasta con sal, al dente.',
        'Freír la cebolla y sudar los champiñones.',
        'Agregar el resto de los ingredientes.',
        'Servir sobre la pasta.',
      ],
      image: 'pasta-de-crema-de-champinones.jpg',
    },
    {
      title: 'Hot Cakes Tiramisú',
      description:
        'Si alguna vez has probado el famoso tiramisú, sabes que es un postre muy cremoso y con un toque de café, lo que le da un balance perfecto de sabor. A nosotros nos gusta tanto este clásico italiano que hicimos estos Hot Cakes Tiramisú, ¡están para chuparse los dedos!',
      ingredients: [
        '2 tazas de harina para hot cakes Tres Estrellas®',
        '1 1/2 tazas de leche',
        '2 huevos',
        '2 cucharadas de mantequilla, derretida',
        '2 cucharadas de café soluble',
        '1 taza de queso crema, en cubos medianos, a temperatura ambiente',
        '2 tazas de crema para batir',
      ],
      steps: [
        'En un bowl, combina la Harina para hot cakes Tres Estrellas ®, la leche, el huevo, la mantequilla derretida y el café soluble. Mezcla con batidora de mano hasta eliminar los grumos y deja reposar por 10 minutos.',
        'Calienta un poco de mantequilla en una sartén a fuego medio, vierte dos cucharones de la masa y cocina a fuego medio por 5 minutos o hasta que se formen burbujas en la superficie, pues esto quiere decir que el hot cake está listo. Voltea y cocina por 5 minutos más.',
        'Repite el mismo proceso hasta terminar con toda la masa.',
        'Acrema el queso crema con una batidora de mano y posteriormente añade la crema batida y el azúcar glas. Mezcla por 3 minutos y reserva.',
        'En un bowl, mezcla la miel de maple con el café expreso. Reserva.',
        'Sirve un hot cake, agrega un poco de crema, coloca otro hot cake encima y añade otra capa de crema. Repite el mismo proceso para obtener otra capa y decora con miel de maple, crema y cocoa en polvo.',
      ],
      image: 'hot-cakes-tiramisu.jpg',
    },
    {
      title: 'Tacos de Hot Cakes con Fruta',
      description:
        'Estos tacos de hot cakes son ideales para el desayuno de los más pequeños, los hot cakes mezclados con cocoa y untados con una suave y delicada capa de Nutella®, rellenos con una mezcla de coctel de frutas, son deliciosas. Este platillo es un desayuno delicioso y, además, balanceado para cualquier integrante de la familia.',
      ingredients: [
        '3 cucharadas de mantequilla',
        '3 cucharadas de cocoa',
        '2 cucharadas de vainilla líquida',
        '200 mililitros de leche de vaca',
        '2 cucharadas de mantequilla, derretida',
        '1 huevo',
        '1 taza de harina para hotcakes',
      ],
      steps: [
        'En un bowl mezcla todos los ingredientes para los hot cakes homogéneamente y reserva.',
        'Calienta una sartén a fuego medio con la mantequilla y forma los hot cakes del tamaño de una tortilla. Reserva.',
        'Unta una cucharada de Nutella® por cada taco de hot cake. Rellena con las frutas. Sirve y disfruta.',
      ],
      image: 'tacos-de-hot-cakes-con-fruta.jpg',
    },
    {
      title: 'Pavo BBQ',
      description:
        'Prepara esta original receta de Pavo BBQ, un crujiente pavo relleno de verduras con la tradicional salsa BBQ y un glaseado hecho con cerveza. Si quieres cambiar la típica receta de pavo para la cena de Nochebuena o comerlo a pesar de que ya no sea Navidad, esta es la preparación perfecta.',
      ingredients: [
        '1 taza de mantequilla, para la mantequilla',
        '1 cucharada de romero fresco, para la mantequilla',
        '1 cucharada de tomillo fresco, para la mantequilla',
        '1 cucharada de salvia, fresca, para la mantequilla',
        '2 dientes de ajo, para la mantequilla',
        '1 pavo natural',
        '1 taza de salsa BBQ, para la reducción',
      ],
      steps: [
        'En una cacerola a fuego medio derrite la mantequilla y agrega el romero, el tomillo, la salvia, el ajo y cocina por 5 minutos hasta que tengas una mantequilla aromatizada. Deja enfriar ligeramente y reserva.',
        'Con ayuda de una jeringa para pavo inyecta el pavo con la mantequilla aromatizada. Reserva.',
        'Para la reducción, cocina la salsa bbq con la miel, el azúcar mascabado, la salsa tabasco, la salsa inglesa, el vinagre balsámico, el agua, la cerveza, el ajo, la cebolla, la mostaza y el tomillo alrededor de 20 minutos o hasta que se haga una mezcla espesa. Deja enfriar y reserva.',
        'Sobre tu tabla de corte Allrounder de Victorinox® pela la manzana con ayuda de tu pelador Victorinox® y corta en cubos medianos con tu cuchillo de cocina Swiss Classic',
        'Para el relleno, en un bowl mezcla el apio, la manzana, los arándanos, la cebolla, el pan y el perejil. Rellena el pavo y amarra.',
        'Precalienta el horno a 180°C.',
      ],
      image: 'pavo-bbq.jpg',
    },
    {
      title: 'Ponche de manzana con caramelo',
      description:
        'El ponche es un clásico que no puede faltar en los hogares mexicanos durante la época decembrina, especialmente en las posadas navideñas y reuniones. En esta ocasión, le dimos un giro y le añadimos Té McCormick® Manzana Canela y caramelo al tradicional ponche de frutas, ¡pruébalo! ¿Sabías qué? El ponche de frutas se inventó en la India.',
      ingredients: [
        '4 litros de agua',
        '2 conos de piloncillo',
        '1 caja de Té McCormick® Manzana Canela',
        '2 cañas, pelada y rebanada',
        '2 manzanas golden, en sextos',
        '3 guayabas, en cuartos',
        '1 naranja',
      ],
      steps: [
        'Coloca nuevamente en el fuego, agrega el tejocote, la caña, la manzana, la guayaba y la naranja. Cocina durante 20 minutos más.',
        'Coloca el agua y el piloncillo en una olla y cocina por 15 minutos o hasta que suelte el hervor. Retira del fuego y agrega el Té McCormick® Manzana Canela. Deja reposar durante 15 minutos.',
        'Vierte un poco de jarabe de caramelo en las paredes de la taza. Sirve el ponche caliente con un poco de fruta y decora con una raja de canela y una rebanada de manzana.',
      ],
      image: 'ponche-de-manzana-con-caramelo.jpg',
    },
    {
      title: 'Mangonada',
      description:
        'En esta época de calor disfruta de una picosita chamoyada de mango con cubitos de fruta fresca y chilito en polvo, te fascinará esta deliciosa mangonada. Es perfecta para disfrutarla en el verano.',
      ingredients: [
        '1 taza de agua',
        '1 taza de azúcar',
        '4 tazas de hielo',
        '5 mangos, (4 piezas para el raspado y una pieza cortada en cubos para decorar)',
        '3/4 tazas de chamoy, líquido (¼ taza para escarchar los vasos)',
        '3/4 tazas de chile en polvo, ¼ taza para escarchar los vasos',
        '1/2 tazas de piña, enchilada',
      ],
      steps: [
        'En una ollita calienta el agua con el azúcar hasta formar un jarabe espeso. Deja enfriar.',
        'Licúa el jarabe con la pulpa de cuatro mangos y el hielo hasta obtener una mezcla homogénea y tersa.',
        'Escarcha los vasos con un poco de chamoy y el chilito en polvo. Decora el interior de los vasos con chamoy.',
        'Vierte la mangonada en los vasos y coloca los cubitos de mango, decora con el chamoy, el chile y los dulces picositos. Sirve.',
      ],
      image: 'mangonada.jpg',
    },
    {
      title: 'Smoothie de Granola con Frutos Rojos',
      description:
        'Prepara éste de rico smoothie de granola con frutos rojos. Es muy sencillo y fácil de hacer, ideal para esas mañanas con prisa. Tiene un rico sabor dulce y un gran valor nutricional gracias a la Granola Kellogg’s® Granos Ancestrales; Amaranto, linaza y arándano. Comienza tus mañanas con éste delicioso smoothie.',
      ingredients: [
        '1 taza de granola Kellogg’S® granos ancestrales; amaranto, linaza y arándano',
        '1/4 tazas de zarzamora',
        '1/4 tazas de fresa, lavada y desinfectada',
        '1/4 tazas de frambuesa, lavadas y desinfectada',
        '1 1/2 tazas de leche de soya',
      ],
      steps: [
        'Licúa los frutos rojos junto con la leche de soya.',
        'Cuela la mezcla para retirar las semillas. Regresa a la licuadora y agrega la Granola Kellogg’s® Granos Ancestrales; Amaranto, linaza y arándano',
        'Agrega un poco de hielo y sirve de inmediato.',
      ],
      image: 'smoothie-de-granola-con-frutos-rojos.jpg',
    },
    {
      title: 'Limonada de Frambuesa',
      description:
        'La limonada de frambuesa es muy refrescante con un toque de tequila para hacerla más interesante y más rica.',
      ingredients: [
        '4 rodajas de limón, partidos en rodajas',
        '6 tazas de agua',
        '1 taza de azúcar',
        '2 1/2 tazas de tequila',
        '2 tazas de frambuesa',
        'hielos, al gusto',
      ],
      steps: [
        'Pon las rodajas de limón, las frambuesas y el azúcar en un bowl. Aplasta la mezcla mara que saque todos los jugos el limón y las frambuesas.',
        'Agrega el agua.',
        'Cuela la mezcla aplastando las frutas intentando sacar todos los jugos.',
        'Agrega el tequila y hielos al gusto.',
      ],
      image: 'limonada-de-frambuesa.jpg',
    },
  ],
  categories: [
    { name: 'Postres y Dulces' },
    { name: 'Arroz' },
    { name: 'Pasta' },
    { name: 'Carnes y Aves' },
    { name: 'Pescado y Marisco' },
    { name: 'Verduras y Hortalizas' },
    { name: 'Sopas, Caldos y Cremas' },
    { name: 'Huevos y Tortillas' },
    { name: 'Salsas y Guarniciones' },
    { name: 'Ensaladas' },
    { name: 'Legumbres y Guisos' },
    { name: 'Tapas y Aperitivos' },
    { name: 'Pan, Masas y Rebozados' },
    { name: 'Bebidas y Cócteles' },
    { name: 'Recetas por Técnica' },
    { name: 'Receptas por Ocasión' },
    { name: 'Recetas por País' },
    { name: 'Otros' },
  ],
};
