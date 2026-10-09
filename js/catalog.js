/* ============================================================
   URHOM — catalogue
   One source of truth for the three collections. The collection
   pages render from it, the header dropdowns are built from it and
   the site-wide search indexes it, so a category or a product is
   named in exactly one place.

   This is sample catalogue copy for a front-end build. There is no
   inventory system, payment or order flow behind any of it.
   ============================================================ */
window.URHOM = window.URHOM || {};

window.URHOM.catalog = {

  furniture: {
    label:   'Furniture',
    page:    'furniture.html',
    assets:  'assets/furniture/',
    blurb:   'Discover furniture designed for modern lifestyles.',
    price:   { min: 5000, max: 500000, step: 1000 },
    facets: [
      { key:'material',     label:'Material',     field:'material' },
      { key:'color',        label:'Color',        field:'color' },
      { key:'style',        label:'Style',        field:'style' },
      { key:'room',         label:'Room',         field:'room' },
      { key:'availability', label:'Availability', field:'stock' }
    ],
    categories: [
      { id:'sofas',       title:'Sofas',              desc:'Comfort meets style',    img:'cat-sofas.jpg',
        alt:'A deep beige sectional sofa dressed with mustard and grey cushions.' },
      { id:'beds',        title:'Beds',               desc:'Sleep in luxury',        img:'cat-beds.jpg',
        alt:'An upholstered bed with olive bedding between two bedside lamps.' },
      { id:'dining-sets', title:'Dining Sets',        desc:'Bring people together',  img:'cat-dining-sets.jpg',
        alt:'A solid wood dining table set with six upholstered chairs.' },
      { id:'chairs',      title:'Chairs',             desc:'For every corner',       img:'cat-chairs.jpg',
        alt:'A mustard velvet accent chair beside a potted plant.' },
      { id:'recliners',   title:'Recliners',          desc:'Relax, redefined',       img:'cat-recliners.jpg',
        alt:'A tan leather recliner reclined open in a sunlit living room.' },
      { id:'wardrobes',   title:'Wardrobes',          desc:'Organize beautifully',   img:'cat-wardrobes.jpg',
        alt:'An open wardrobe with hanging clothes and folded shelves.' },
      { id:'tv-units',    title:'TV Units',           desc:'Style your space',       img:'cat-tv-units.jpg',
        alt:'A low wooden TV unit with planters either side of the screen.' },
      { id:'storage',     title:'Storage & Cabinets', desc:'Smart storage',          img:'cat-storage.jpg',
        alt:'A cream sideboard with an open centre shelf and tall planters.' }
    ],
    products: [
      { id:1, name:'Orion L-Shaped Sofa',       cats:['sofas'],       price:124999, mrp:149999, rating:4.5, reviews:24,
        img:'p-orion-l-shaped-sofa.jpg', swatches:['#e9e1d4','#c8b9a3','#8a7a66'],
        material:'Fabric', color:'Beige',  style:'Modern',      room:'Living Room', stock:'In Stock',
        alt:'An L-shaped beige fabric sofa with a round marble coffee table.' },
      { id:2, name:'Nova Upholstered Bed',      cats:['beds'],        price:89999,  mrp:109999, rating:4.5, reviews:18, tag:'New',
        img:'p-nova-upholstered-bed.jpg', swatches:['#efe9df','#cbc3b2','#5c6a4a'],
        material:'Fabric', color:'Cream',  style:'Contemporary', room:'Bedroom',    stock:'In Stock',
        alt:'A cream upholstered bed with a channel headboard and olive throw.' },
      { id:3, name:'Astra 6 Seater Dining Set', cats:['dining-sets'], price:74999,  mrp:89999,  rating:4.5, reviews:32,
        img:'p-astra-6-seater-dining-set.jpg', swatches:['#dfd3bf','#b08f64','#7a5a3a'],
        material:'Solid Wood', color:'Oak', style:'Modern',      room:'Dining Room', stock:'In Stock',
        alt:'A six seater wooden dining table set under pendant lights.' },
      { id:4, name:'Luxe Recliner Chair',       cats:['recliners'],   price:62999,  mrp:79999,  rating:4.5, reviews:41,
        img:'p-luxe-recliner-chair.jpg', swatches:['#d9c3a6','#b08b62','#6b4a2e'],
        material:'Leatherette', color:'Tan', style:'Contemporary', room:'Living Room', stock:'In Stock',
        alt:'A tan leatherette recliner chair with the footrest extended.' },
      { id:5, name:'Vero Accent Chair',         cats:['chairs'],      price:18999,  mrp:24999,  rating:4.0, reviews:15,
        img:'p-vero-accent-chair.jpg', swatches:['#e7dfd2','#c3b49e','#7a5a3a'],
        material:'Fabric', color:'Beige',  style:'Mid-Century',  room:'Living Room', stock:'In Stock',
        alt:'A rounded beige accent chair on slim tapered wooden legs.' },
      { id:6, name:'Elite 4 Door Wardrobe',     cats:['wardrobes'],   price:112999, mrp:139999, rating:4.5, reviews:28,
        img:'p-elite-4-door-wardrobe.jpg', swatches:['#e3d2b8','#c09b6d','#8a6338'],
        material:'Engineered Wood', color:'Oak', style:'Modern',  room:'Bedroom',    stock:'Made to Order',
        alt:'A four door oak wardrobe with a bank of drawers beneath.' },
      { id:7, name:'Zen TV Unit',               cats:['tv-units'],    price:42999,  mrp:54999,  rating:4.5, reviews:19,
        img:'p-zen-tv-unit.jpg', swatches:['#e0cfb4','#b8955f','#2b2a28'],
        material:'Engineered Wood', color:'Walnut', style:'Minimal', room:'Living Room', stock:'In Stock',
        alt:'A long wooden TV unit with drawers and a wall-mounted screen above.' },
      { id:8, name:'Modular Storage Cabinet',   cats:['storage'],     price:36999,  mrp:47999,  rating:4.0, reviews:11,
        img:'p-modular-storage-cabinet.jpg', swatches:['#e6dac4','#c2a378','#8a6a45'],
        material:'Engineered Wood', color:'Oak', style:'Minimal',  room:'Living Room', stock:'In Stock',
        alt:'A four door wooden storage cabinet topped with vases and planters.' }
    ]
  },

  furnishing: {
    label:   'Furnishing',
    page:    'furnishing.html',
    assets:  'assets/furnishing/',
    blurb:   'Explore premium furnishings for every corner of your home and office.',
    slides: [
      { t:'Elegant Curtains', s:'For brighter, calmer spaces' },
      { t:'Natural Flooring', s:'Warmth underfoot, room to room' },
      { t:'Textured Panels',  s:'Quiet depth on every wall' }
    ],
    price:   { min: 500, max: 50000, step: 100 },
    facets: [
      { key:'material',     label:'Material',        field:'material' },
      { key:'color',        label:'Color',           field:'color' },
      { key:'finish',       label:'Pattern / Finish',field:'finish' },
      { key:'room',         label:'Room',            field:'room' },
      { key:'availability', label:'Availability',    field:'stock' }
    ],
    categories: [
      { id:'curtains',     title:'Curtains',        desc:'Sheer, blackout & more',  img:'cat-curtains.jpg',
        alt:'Sheer curtains filtering daylight beside a bed and potted plant.' },
      { id:'blinds',       title:'Blinds',          desc:'Stylish light control',   img:'cat-blinds.jpg',
        alt:'Wooden venetian blinds casting striped light across a room.' },
      { id:'mesh-doors',   title:'Mesh Doors',      desc:'Insect protection',       img:'cat-mesh-doors.jpg',
        alt:'A glazed mesh door opening onto a balcony with a city view.' },
      { id:'flooring',     title:'Flooring',        desc:'Vinyl, wooden & laminate',img:'cat-flooring.jpg',
        alt:'Warm oak plank flooring running through a sunlit room.' },
      { id:'wall-panels',  title:'Wall Panels',     desc:'Textured elegance',       img:'cat-wall-panels.jpg',
        alt:'Slatted timber wall panelling behind a cushioned bench.' },
      { id:'rugs',         title:'Rugs & Carpets',  desc:'Comfort underfoot',       img:'cat-rugs.jpg',
        alt:'A deep-pile textured rug laid in front of a sofa.' },
      { id:'cushions',     title:'Cushion Covers',  desc:'Style in every detail',   img:'cat-cushions.jpg',
        alt:'Rust and grey textured cushion covers stacked on a sofa.' },
      { id:'bed-linen',    title:'Bed Linen',       desc:'Softness redefined',      img:'cat-bed-linen.jpg',
        alt:'A neatly dressed bed in cream linen between two bedside lamps.' }
    ],
    products: [
      { id:1, name:'Linen Sheer Curtain',          cats:['curtains'],    price:2499, rating:5.0, reviews:24,
        img:'p-linen-sheer-curtain.jpg', swatches:['#e8e2d8','#cdbfa8'],
        material:'Linen',   color:'Cream',  finish:'Sheer',      room:'Living Room', stock:'In Stock',
        alt:'Floor-length linen sheer curtains softening the light beside a sofa and lamp.' },
      { id:2, name:'Blackout Curtain',             cats:['curtains'],    price:3999, rating:4.5, reviews:18,
        img:'p-blackout-curtain.jpg', swatches:['#efe9e0','#c9b79f','#8c7a66','#4a4038','#1c1a18'],
        material:'Polyester', color:'Beige', finish:'Blackout',  room:'Bedroom',     stock:'In Stock',
        alt:'Heavy blackout curtains drawn beside a sheer panel in a calm bedroom.' },
      { id:3, name:'Wooden Venetian Blinds',       cats:['blinds'],      price:4999, rating:4.5, reviews:32,
        img:'p-wooden-venetian-blinds.jpg', swatches:['#e3d6c3','#b4895c','#7a5433'],
        material:'Wood',    color:'Walnut', finish:'Matte',      room:'Living Room', stock:'In Stock',
        alt:'Wooden venetian blinds throwing banded sunlight into a plant-filled room.' },
      { id:4, name:'Mesh Sliding Door',            cats:['mesh-doors'],  price:6499, rating:4.5, reviews:21,
        img:'p-mesh-sliding-door.jpg', swatches:['#ffffff','#9a9a9a','#1b1b1b'],
        material:'Aluminium', color:'Black', finish:'Matte',     room:'Balcony',     stock:'Made to Order',
        alt:'A black-framed mesh sliding door opening onto a terrace and skyline.' },
      { id:5, name:'Premium Vinyl Flooring',       cats:['flooring'],    price:5999, rating:5.0, reviews:19,
        img:'p-premium-vinyl-flooring.jpg', swatches:['#e9ded0','#d4bfa4','#b08f6b','#8a6a4b'],
        material:'Vinyl',   color:'Oak',    finish:'Wood Grain', room:'Living Room', stock:'In Stock',
        alt:'Wide vinyl planks in a pale oak finish running toward a garden window.' },
      { id:6, name:'Engineered Wooden Flooring',   cats:['flooring'],    price:8999, rating:4.5, reviews:27,
        img:'p-engineered-wooden-flooring.jpg', swatches:['#e4d4bd','#c69a6d','#8a5c33'],
        material:'Engineered Wood', color:'Walnut', finish:'Herringbone', room:'Bedroom', stock:'In Stock',
        alt:'Herringbone engineered wood flooring laid through a bedroom.' },
      { id:7, name:'Wall Panel (Wood Finish)',     cats:['wall-panels'], price:4499, rating:4.0, reviews:16,
        img:'p-wall-panel-wood.jpg', swatches:['#c49a6c','#9a6b41','#5d3c22'],
        material:'MDF',     color:'Walnut', finish:'Fluted',     room:'Living Room', stock:'In Stock',
        alt:'Fluted walnut wall panelling behind two pale ceramic vases.' },
      { id:8, name:'Rug & Carpet',                 cats:['rugs'],        price:3999, rating:4.5, reviews:33,
        img:'p-rug-carpet.jpg', swatches:['#e6ddd0','#c9b49a','#8d7a63','#7d2b2b'],
        material:'Wool Blend', color:'Sand', finish:'Textured',  room:'Living Room', stock:'In Stock',
        alt:'A soft sand-toned rug under a round coffee table beside a sofa.' }
    ]
  },

  interiors: {
    label:   'Interiors',
    page:    'interiors.html',
    assets:  'assets/interiors/',
    blurb:   'Discover interior essentials to style every space in your home.',
    price:   { min: 200, max: 50000, step: 100 },
    facets: [
      { key:'material',     label:'Material',     field:'material' },
      { key:'color',        label:'Color',        field:'color' },
      { key:'style',        label:'Style',        field:'style' },
      { key:'room',         label:'Room',         field:'room' },
      { key:'availability', label:'Availability', field:'stock' }
    ],
    categories: [
      { id:'bed-bath',           title:'Bed & Bath',         desc:'Everyday comfort',      img:'cat-bed-bath.jpg',
        alt:'A neat stack of grey and cream bath towels beside a potted plant.' },
      { id:'carpets-rugs',       title:'Carpets & Rugs',     desc:'Warmth underfoot',      img:'p-nordic-textured-rug.jpg',
        alt:'A cream textured rug with a soft geometric pile in a sunlit living room.' },
      { id:'doormats',           title:'Doormats',           desc:'A warm welcome',        img:'p-coir-doormat.jpg',
        alt:'A natural coir doormat on tiled flooring in front of a dark door.' },
      { id:'artificial-grass',   title:'Artificial Grass',   desc:'Evergreen, always',     img:'cat-artificial-grass.jpg',
        alt:'Close-up of dense artificial grass turf.' },
      { id:'cushions',           title:'Cushions & Pillows', desc:'Soft accents',          img:'cat-cushions.jpg',
        alt:'A teal velvet cushion with a brass ring detail against cream cushions.' },
      { id:'bedsheets',          title:'Bedsheets',          desc:'Rest, refreshed',       img:'cat-bedsheets.jpg',
        alt:'A grey striped bedsheet set dressed on a bed beside a bedside table.' },
      { id:'towels',             title:'Towels',             desc:'Soft and absorbent',    img:'cat-towels.jpg',
        alt:'Folded cream towels stacked beside a cushion.' },
      { id:'vases',              title:'Vases & Planters',   desc:'Green, styled',         img:'cat-vases.jpg',
        alt:'A white and a black round vase planted with fresh greenery.' },
      { id:'wall-decor',         title:'Wall Decor',         desc:'Walls with character',  img:'cat-wall-decor.jpg',
        alt:'Two framed brass wall pieces hung above a styled console.' },
      { id:'lighting',           title:'Lighting & Lamps',   desc:'Set the mood',          img:'cat-lighting.jpg',
        alt:'A ceramic table lamp glowing beside two planted pots.' },
      { id:'decorative-accents', title:'Decorative Accents', desc:'Finishing touches',     img:'cat-decorative-accents.jpg',
        alt:'A round wooden mirror above a shelf of vases and greenery.' },
      { id:'mirrors',            title:'Mirrors',            desc:'Light and space',       img:'cat-mirrors.jpg',
        alt:'An arched mirror reflecting ferns and ceramics on a console.' },
      { id:'lights',             title:'Lights',             desc:'Warmth, switched on',   img:'p-wooden-table-lamp.jpg',
        alt:'A ceramic table lamp lit beside two planted pots.' },
      { id:'clocks',             title:'Clocks',             desc:'Time, beautifully',     img:'cat-clocks.jpg',
        alt:'A black wall clock with brass hands above a wooden sideboard.' },
      { id:'storage-baskets',    title:'Storage Baskets',    desc:'Tidy, naturally',       img:'cat-storage-baskets.jpg',
        alt:'Two handled seagrass storage baskets beside a plant.' }
    ],
    products: [
      { id:1, name:'Nordic Textured Rug',          cats:['carpets-rugs'],              price:4999, mrp:7999, rating:4.5, reviews:24,
        img:'p-nordic-textured-rug.jpg', swatches:['#9a9a98','#c6c2ba','#8b8378'],
        material:'Wool Blend', color:'Ivory',   style:'Nordic',       room:'Living Room', stock:'In Stock',
        alt:'A cream textured rug with a soft geometric pile in a sunlit living room.' },
      { id:2, name:'Premium Cotton Bedsheet Set',  cats:['bedsheets','bed-bath'],      price:2499, mrp:3999, rating:4.5, reviews:18,
        img:'p-premium-cotton-bedsheet-set.jpg', swatches:['#efeae0','#3f4a5c','#2a2f3a'],
        material:'Cotton',   color:'Ivory',     style:'Classic',      room:'Bedroom',     stock:'In Stock',
        alt:'A cream cotton bedsheet set dressed with navy cushions and a folded throw.' },
      { id:3, name:'Linen Cushion Cover (Set of 2)', cats:['cushions'],                price:1299, mrp:1999, rating:4.5, reviews:32,
        img:'p-linen-cushion-cover.jpg', swatches:['#e8e1d4','#6b5a4a','#a8503a'],
        material:'Linen',    color:'Rust',      style:'Textured',     room:'Living Room', stock:'In Stock',
        alt:'A rust embossed linen cushion resting against cream cushions on a sofa.' },
      { id:4, name:'Ceramic Flower Vase',          cats:['vases','decorative-accents'],price:1899, mrp:2999, rating:4.5, reviews:41,
        img:'p-ceramic-flower-vase.jpg', swatches:['#efe7da','#8a7a66','#6b4e2e'],
        material:'Ceramic',  color:'Off White', style:'Minimal',      room:'Living Room', stock:'In Stock',
        alt:'Two pale ceramic vases beside a brass bottle on a sunlit sideboard.' },
      { id:5, name:'Premium Artificial Grass Roll', cats:['artificial-grass'],         price:5999, mrp:8999, rating:4.5, reviews:27,
        img:'p-premium-artificial-grass-roll.jpg', swatches:['#3f7a2e','#cfd6c4'],
        material:'Synthetic Turf', color:'Green', style:'Outdoor',    room:'Balcony',     stock:'In Stock',
        alt:'A rolled length of artificial grass turf laid out on a lawn.' },
      { id:6, name:'Coir Doormat',                 cats:['doormats'],                  price:799,  mrp:1299, rating:4.5, reviews:19,
        img:'p-coir-doormat.jpg', swatches:['#c08a4a','#7a2f2a','#8a6a45'],
        material:'Coir',     color:'Natural',   style:'Classic',      room:'Entryway',    stock:'In Stock',
        alt:'A natural coir doormat on tiled flooring in front of a dark door.' },
      { id:7, name:'Metal Wall Art',               cats:['wall-decor'],                price:3999, mrp:5999, rating:4.0, reviews:16,
        img:'p-metal-wall-art.jpg', swatches:['#e4dccf','#9a7b4a','#2e2b27'],
        material:'Metal',    color:'Black',     style:'Contemporary', room:'Living Room', stock:'In Stock',
        alt:'A fan-shaped metal and brass wall sculpture mounted on a cream wall.' },
      { id:8, name:'Wooden Table Lamp',            cats:['lighting','lights'],                  price:2499, mrp:3999, rating:4.5, reviews:28,
        img:'p-wooden-table-lamp.jpg', swatches:['#efe3cd','#9a8b74','#6b5a44'],
        material:'Wood',     color:'Natural',   style:'Minimal',      room:'Bedroom',     stock:'In Stock',
        alt:'A ceramic table lamp with a linen shade lit beside two planted pots.' },
      { id:9, name:'Premium Bath Towel Set',       cats:['towels','bed-bath'],         price:1899, mrp:2999, rating:4.5, reviews:22,
        img:'p-premium-bath-towel-set.jpg', swatches:['#2b2f36','#8d8d8b','#e6e2d8'],
        material:'Cotton',   color:'Grey',      style:'Classic',      room:'Bathroom',    stock:'In Stock',
        alt:'Folded grey and cream bath towels stacked on a bed.' },
      { id:10, name:'Woven Storage Basket',        cats:['storage-baskets'],           price:1299, mrp:1999, rating:4.5, reviews:17,
        img:'p-woven-storage-basket.jpg', swatches:['#d8b483','#b08a55','#8a6a45'],
        material:'Seagrass', color:'Natural',   style:'Rustic',       room:'Living Room', stock:'In Stock',
        alt:'Two handled seagrass storage baskets standing against a warm wall.' },
      { id:11, name:'Minimal Wall Clock',          cats:['clocks','wall-decor'],       price:1499, mrp:2499, rating:4.5, reviews:35,
        img:'p-minimal-wall-clock.jpg', swatches:['#2e2b27','#b8954f'],
        material:'Wood',     color:'Black',     style:'Minimal',      room:'Living Room', stock:'In Stock',
        alt:'A black wall clock with brass markers hung above a row of potted ferns.' },
      { id:12, name:'Decorative Accent Piece',     cats:['decorative-accents'],        price:2999, mrp:4999, rating:4.0, reviews:21,
        img:'p-decorative-accent-piece.jpg', swatches:['#efe9dd','#c4a877','#8a7a66'],
        material:'Ceramic',  color:'Off White', style:'Sculptural',   room:'Living Room', stock:'In Stock',
        alt:'A white sculptural ring ornament resting on a stack of books.' }
    ]
  }
};

/* a flat, searchable view of everything above — used by the header search */
window.URHOM.index = (function (cat) {
  var rows = [];
  Object.keys(cat).forEach(function (key) {
    var c = cat[key];
    c.categories.forEach(function (x) {
      rows.push({ kind:'category', key:key, id:x.id, name:x.title, desc:x.desc,
                  img:c.assets + x.img, href:c.page + '#cat=' + x.id, group:c.label });
    });
    c.products.forEach(function (p) {
      rows.push({ kind:'product', key:key, id:p.id, name:p.name, price:p.price,
                  desc:[p.material, p.color, p.room].filter(Boolean).join(' · '),
                  img:c.assets + p.img, href:c.page + '#cat=' + p.cats[0], group:c.label,
                  hay:[p.name, p.material, p.color, p.style, p.finish, p.room]
                        .filter(Boolean).join(' ').toLowerCase() });
    });
  });
  return rows;
})(window.URHOM.catalog);
