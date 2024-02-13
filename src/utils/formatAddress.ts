const formatAddress = ({
  street, 
  condo, 
  unit, 
  lot
}:{
  street: string; 
  condo:string; 
  unit:string; 
  lot:string;
} ) => {

  const address = []

  if(lot) address.push(`${lot}`) 
  address.push(street)
  if(condo) address.push(condo) 
  if(unit) address.push(`Unit ${unit}`) 

  return address.join(', ')
}

export default formatAddress
