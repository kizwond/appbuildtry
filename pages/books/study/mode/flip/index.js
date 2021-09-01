import React, { useState, useEffect, Fragment } from "react";
import StudyLayout from "../../../../../components/layout/StudyLayout";

const FlipMode = () => {
  return (
    <StudyLayout>
        <div>
            <div style={{marginTop:"50px", margin:"auto", width:"600px", height:"500px", border:"1px solid grey"}}>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"100%"}}>
                    <div style={{display:"flex",height:"80%", alignItems:"center",justifyContent: "center"}}>
                        contents
                    </div>
                    <div style={{padding:10, display:"flex",alignItems:"center",justifyContent: "space-around"}}>
                        <button>5분뒤한번더</button>
                        <button>10분뒤한번더</button>
                        <button>20분뒤한번더</button>
                        <button>30분뒤한번더</button>
                        <button>세션탈출</button>
                        
                    </div>
                </div>
            </div>
        </div>
      <div>뒤집기모드</div>
    </StudyLayout>
  );
};

export default FlipMode;
