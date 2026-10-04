/* The Elevation Church (TEC) expressions worldwide.
   Source: elevationng.org/locations (checked Oct 2026). Global Lead Pastor: Godman Akinlabi.
   `id` values are stored in user profiles — don't change an id once people have signed up. */
const EXPRESSIONS = [
  // Nigeria · Lagos
  {id:"tec-jakande-lekki",   name:"TEC Jakande Lekki",   city:"Lekki, Lagos",       country:"Nigeria", region:"Lagos",  address:"1 Resurrection Drive, opposite Nicon Town, Lekki-Epe Expressway, Lagos", times:"Sundays 7:00, 9:00 & 11:30 AM"},
  {id:"tec-maryland",        name:"TEC Maryland",        city:"Maryland, Lagos",    country:"Nigeria", region:"Lagos",  address:"Pistis Hub, 1A Ikorodu Road, Maryland Bus Stop, Ikeja, Lagos", times:"Sundays 9:00 AM"},
  {id:"tec-ikoyi",           name:"TEC Ikoyi",           city:"Ikoyi, Lagos",       country:"Nigeria", region:"Lagos",  address:"The Strong Tower Hall, 40 Alfred Rewane Road, opposite Marriage Registry, Ikoyi, Lagos", times:"Sundays 9:00 AM"},
  {id:"tec-greater-lekki",   name:"TEC Greater Lekki",   city:"Sangotedo, Lagos",   country:"Nigeria", region:"Lagos",  address:"T & T Parkwest Event Centre, Km 44 Lekki-Epe Expressway, beside Mobil, Sangotedo, Lagos", times:"Sundays 9:00 AM"},
  {id:"tec-ibeju-lekki",     name:"TEC Ibeju Lekki",     city:"Ibeju-Lekki, Lagos", country:"Nigeria", region:"Lagos",  address:"Ephies Hall, Km 39, opposite Beechwood Estate, Malete Bus Stop, Ibeju-Lekki", times:"Sundays 8:00 & 10:00 AM"},
  {id:"tec-ogba",            name:"TEC Ogba",            city:"Ogba, Lagos",        country:"Nigeria", region:"Lagos",  address:"Pistis Hub, 1 Niwil Close, by Globus Bank, Oba Akran Avenue, Ikeja, Lagos", times:"Sundays 9:00 AM"},
  {id:"tec-ikorodu-west",    name:"TEC Ikorodu West",    city:"Ikorodu, Lagos",     country:"Nigeria", region:"Lagos",  address:"Pistis Hub, 1 Oba Sekunmade Road by Zenith Bank, opposite Ferry Terminal, Ipakodo, Ikorodu", times:"Sundays 9:00 AM"},
  {id:"tec-ikorodu-north",   name:"TEC Ikorodu North",   city:"Ikorodu, Lagos",     country:"Nigeria", region:"Lagos",  address:"Somi Jaiye Simi Hall, Oriwu Club House, Shagamu Road, Ikorodu", times:"Sundays 9:00 AM"},
  {id:"tec-alimosho",        name:"TEC Alimosho",        city:"Alimosho, Lagos",    country:"Nigeria", region:"Lagos",  address:"Noble Castle Event Centre, Isheri-Igando Road, by Lanre Bus Stop, Alimosho", times:"Sundays 9:00 AM"},
  {id:"tec-festac",          name:"TEC FESTAC",          city:"FESTAC, Lagos",      country:"Nigeria", region:"Lagos",  address:"Arthur Mbanefo Hall, Festival Hotel Conference Center, FESTAC", times:"Sundays 9:00 AM"},
  {id:"lifepointe-lekki",    name:"LifePointe Lekki",    city:"Lekki, Lagos",       country:"Nigeria", region:"Lagos",  address:"3 Remi Olowude Street, Lekki 2nd Roundabout, Lekki, Lagos", times:"Sundays 9:00 AM"},
  {id:"lifepointe-yaba",     name:"LifePointe Yaba",     city:"Yaba, Lagos",        country:"Nigeria", region:"Lagos",  address:"Banilux Events Center, 2/8 Chapel Street, Sabo, Yaba, Lagos", times:"Sundays 9:00 AM"},
  {id:"lifepointe-ojo",      name:"LifePointe Ojo",      city:"Ojo, Lagos",         country:"Nigeria", region:"Lagos",  address:"Choice and Choices Event Center, 6 Great Challenge, Iyana-School Bus Stop, Iba, Ojo", times:"Sundays 9:00 AM"},
  {id:"lifepointe-greater-lekki", name:"LifePointe Greater Lekki", city:"Sangotedo, Lagos", country:"Nigeria", region:"Lagos", address:"Screen 4, Nova Cinema, Novare Mall, Sangotedo, Lagos", times:"Sundays 9:00 AM"},
  // Nigeria · other states
  {id:"tec-ibadan",          name:"TEC Ibadan",          city:"Ibadan, Oyo",        country:"Nigeria", region:"Ibadan", address:"Pistis Hub, 2 Olaniyan Fagbemi Street, off Mobil Bus Stop, Ring Road, Ibadan", times:"Sundays 9:00 AM"},
  {id:"tec-abeokuta",        name:"TEC Abeokuta",        city:"Abeokuta, Ogun",     country:"Nigeria", region:"Ogun",   address:"OOPL Main Auditorium, Olusegun Obasanjo Presidential Library, Oke-Mosan, Abeokuta", times:"Sundays 9:00 AM"},
  {id:"tec-abuja",           name:"TEC Abuja",           city:"Jabi, Abuja",        country:"Nigeria", region:"Abuja",  address:"Sandralia Hotel by Whitestone, 1 Solomon Lar Way, Jabi, Abuja", times:"Sundays 9:00 AM"},
  {id:"tec-port-harcourt",   name:"TEC Port Harcourt",   city:"Port Harcourt, Rivers", country:"Nigeria", region:"Rivers", address:"The Ark Event Center, 237 Aba Road, opposite Bori Camp, Port Harcourt", times:"Sundays 9:00 AM"},
  // United Kingdom
  {id:"tec-london",          name:"TEC London",          city:"London",             country:"United Kingdom", region:"London", address:"Screens 8 & 9, Vue Cinemas, Angel Central, 21 Parkfield Street, London N1 0PS", times:"Sundays 10:00 AM"},
  {id:"tec-manchester",      name:"TEC Manchester",      city:"Salford, Manchester", country:"United Kingdom", region:"Manchester", address:"MSG 21, Mary Seacole Building, Salford M6 6PU", times:"Sundays 10:30 AM"},
  {id:"tec-leeds",           name:"TEC Leeds",           city:"Leeds",              country:"United Kingdom", region:"Leeds", address:"Screen 5, Vue Cinema Leeds, Kirkstall Road, Cardigan Fields, Leeds LS4 2DG", times:"Sundays 10:30 AM"},
  {id:"tec-bristol",         name:"TEC Bristol",         city:"Bristol",            country:"United Kingdom", region:"Bristol", address:"Screens 2 & 3, Vue Cinema, Bristol Cribbs The Venue, Bristol BS10 7SR", times:"Sundays 10:30 AM"},
  // United States
  {id:"pistis-life-dallas",  name:"Pistis Life Church Dallas",  city:"Frisco, Texas", country:"United States", region:"Texas", address:"Cinemark, Auditorium 9, 5655 Frisco Square Blvd, Frisco, TX 75034", times:"Sundays 10:00 AM"},
  {id:"pistis-life-houston", name:"Pistis Life Church Houston", city:"Sugar Land, Texas", country:"United States", region:"Texas", address:"9750 S H6, Suite 107, Sugar Land, TX 77498", times:"Sundays 10:00 AM"},
  {id:"pistis-life-north-carolina", name:"Pistis Life Church North Carolina", city:"Chapel Hill, North Carolina", country:"United States", region:"North Carolina", address:"Varsity Theatre, 123 East Franklin Street, Chapel Hill, NC 27514", times:"Sundays 10:00 AM"},
  // Canada
  {id:"elevate-toronto",     name:"Elevate Community Church Toronto", city:"Toronto, Ontario", country:"Canada", region:"Ontario", address:"Windsor Hall, Four Points by Sheraton Toronto Airport", times:"Sundays 10:00 AM"},
  {id:"elevate-ottawa",      name:"Elevate Community Church Ottawa",  city:"Ottawa, Ontario",  country:"Canada", region:"Ontario", address:"Cineplex Auditorium 11, 3090 Carling Ave, Ottawa, ON K2B 7K2", times:"Sundays 10:00 AM"},
  {id:"elevate-halifax",     name:"Elevate Community Church Halifax", city:"Halifax, Nova Scotia", country:"Canada", region:"Nova Scotia", address:"Cineplex Scotiabank Theatre, 190 Chain Lake Drive, Halifax", times:"Sundays 10:00 AM"},
  {id:"elevate-calgary",     name:"Elevate Community Church Calgary", city:"Calgary, Alberta", country:"Canada", region:"Calgary", address:"Glamorgan Community Association, 4207 41 Ave SW, Calgary, AB T3E 1G2", times:"Sundays 10:00 AM"},
  // Belgium
  {id:"tec-brussels",        name:"TEC Brussels",        city:"Brussels",           country:"Belgium", region:"Belgium", address:"Pistis Hub, Avenue Wielemans Ceuppens 45, 1190 Brussels", times:"Sundays 10:00 AM"},
  // Online
  {id:"tec-online",          name:"TEC Online",          city:"Anywhere",           country:"Online", region:"Online", address:"Live on YouTube @TheElevationTv", times:"Sundays (live)"}
];
const EXPRESSION_COUNTRIES=["Nigeria","United Kingdom","United States","Canada","Belgium","Online"];
const expressionById=id=>EXPRESSIONS.find(e=>e.id===id);
function expressionOptions(selected,{withAll=false}={}){
  return (withAll?`<option value="">All expressions worldwide</option>`:`<option value="">Choose your expression</option>`)+
    EXPRESSION_COUNTRIES.map(c=>`<optgroup label="${c}">${EXPRESSIONS.filter(e=>e.country===c).map(e=>`<option value="${e.id}" ${e.id===selected?"selected":""}>${e.name} · ${e.city}</option>`).join("")}</optgroup>`).join("");
}
