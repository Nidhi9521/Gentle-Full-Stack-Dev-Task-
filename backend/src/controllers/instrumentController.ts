import { Request, Response } from 'express';
import fs from 'fs'
import path from 'path'
export const getInstruments = async (req: Request, res: Response) => {
  try {
    //filter chips (All / Pinned / Gainers / Losers)
     const { q, page = 1, limit = 20, filterchip } = req.query;

    const filePath = path.join(__dirname, '../../instruments.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const instruments = JSON.parse(jsonData);
    let data = instruments
    if(q){
      data = instruments.filter((x:any)=>x.name.includes(q)||x.symbol.includes(q))
    }
    if(filterchip){
      switch(filterchip){
        case "pinned":
          data = data.filter((x:any)=>x.pinned)
          break
        case "gainers":
          data = data.filter((x:any)=>x.price_change_24h_percentage>=0)
          break
        case "losers":
          data = data.filter((x:any)=>x.price_change_24h_percentage<0)
          break
      }
    }
   const newData=data.slice((Number(page) - 1 ) * Number(limit) ,Number(page) * Number(limit))
    setTimeout(() =>{res.json({
          success: true,
          data: newData,
        })},600)
  } catch (error: any) {
    console.error('Error fetching users from database:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed or query error',
      details: error.message,
    });
  }
};

export const addToPin = async (req:Request, res:Response) => {
try {
    const { id } = req.params;
    const filePath = path.join(__dirname, '../../instruments.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const instruments = JSON.parse(jsonData);
    let data = instruments
    const instrument = instruments.find((x:any)=>x.id==id)
    if (!instrument) {
      return res.status(404).json({ success: false, error: 'Instrument not found' });
    }
    instrument.pinned = !instrument.pinned;
    fs.writeFileSync(filePath, JSON.stringify(data),(error:any)=>{
      if(error){
        return res.status(500).json({
            success: false,
            error: 'Database connection failed or query error',
            details: error.message,
          });
      }
      res.json({ success: true, data: instrument });
     
    });
    
       
    
} catch (error:any) {
   console.error('Error fetching users from database:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed or query error',
      details: error.message,
    });
}

}
