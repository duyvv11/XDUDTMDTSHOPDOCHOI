import {useEffect, useState} from "react"
function BrandPage(){
  const [brand, setbrand]= useState("");
  const fetchBranData = async()=>{
    try {
      const res = await fetch('http://localhost:5000/api/brand/');
      const data = await res.json();
      setbrand(data);
    } catch (error) {
      console.log(error);  
    }
    

  }
  useEffect(
    fetchBranData
  )
  return(
    <div className="container-brand">
      <h2>Thương Hiệu</h2>
      {brand.map(it =>{
        <div key={brand.id} className="brand-item"></div>
      })}
      <div>

      </div>

    </div>
    
    
  )
}
export default BrandPage;