const DESTINATION_IMAGE_MAP = {
  "Kathmandu": "https://upload.wikimedia.org/wikipedia/commons/3/35/Kathmandu-Durbar_Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg",
  "Pokhara": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pokhara_Valley.jpg",
  "Chitwan": "https://upload.wikimedia.org/wikipedia/commons/8/82/Chitwan_swamp.jpg",
  "Lumbini": "https://upload.wikimedia.org/wikipedia/commons/1/18/BRP_Lumbini_Mayadevi_temple.jpg",
  "Everest Base Camp": "https://upload.wikimedia.org/wikipedia/commons/1/15/Mt._Everest_from_Gokyo_Ri_November_5%2C_2012.jpg",
  "Bhaktapur": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Nyatpola_%26_Bhairav_Temple.jpg",
  "Patan": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Patan_Durbar_Square_Night_View.jpg",
  "Namche Bazaar": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Namche_Bazaar_Nepal.jpg",
  "Mustang": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Kagbeni_Mustang_District_Nepal.jpg",
  "Rara Lake": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Rara_lake%2C_Mugu.jpg",
  "Bandipur": "https://upload.wikimedia.org/wikipedia/commons/2/27/Bandipur_%E2%80%93_Bindhybashini-Temple_-_01.jpg",
  "Ghandruk": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Ghandruk-1.jpg",
  "Tilicho Lake": "https://upload.wikimedia.org/wikipedia/commons/3/3a/The_Holy_Gosainkunda_Lake_during_the_winter._%28By_Saroj_Pandey%29.jpg",
  "Poon Hill": "https://upload.wikimedia.org/wikipedia/commons/9/91/Dhaulagiri_-_view_from_aircraft.jpg",
  "Gokyo Lakes": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Valley%2C_Tengboche%2C_Mountains_of_Nepal.jpg",
  "Swayambhunath": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Swayambhunath_2018.jpg",
  "Langtang Valley": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Langtang_Valley.jpg",
  "Boudhanath": "https://upload.wikimedia.org/wikipedia/commons/5/53/Boudhanath_Stupa_after_reconstruction.jpg",
  "Nagarkot": "https://upload.wikimedia.org/wikipedia/commons/6/66/2015-03-18_Nagarkot_Hotel_Galaxy_DSCF2094.jpg",
  "Bardiya": "https://upload.wikimedia.org/wikipedia/commons/0/00/Bengal_Tiger_Bardiya.jpg"
};

const FALLBACK_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pokhara_Valley.jpg";

export function getDestinationImage(title) {
  if (!title) return FALLBACK_IMAGE;
  return DESTINATION_IMAGE_MAP[title] || FALLBACK_IMAGE;
}
