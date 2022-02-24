import React, {useState, useEffect} from 'react';


const Works = (userId) => {
  const [userIdT, setUserIdT] = useState("");
  const [id, setid] = useState("");

  useEffect(() => {
    findingUserId();
  }, []);

  const findingUserId = () => {
    console.log("pathname: " + userId.location['pathname'].slice(9,(userId.location['pathname']).length - 6))

    let temp = userId.location['pathname'].slice(9,(userId.location['pathname']).length - 6)
    console.log("temp " + temp.toString())
    
    if (temp.toString() != null) { // user id passed in
      console.log("What gonna put in localstorage " + temp)
      localStorage.setItem("userId", JSON.stringify(temp))
    }
    else { // user id not passed in
      let saved = JSON.parse(localStorage.getItem("userId"))
      window.location.href="http://localhost:3005/creator=" + saved + "/works"
    }
  }
  
  return(
    <div className="content">
      <h1 className="subtopic text">Here are your works!</h1>
      <p className="description text">Lorem ipsum dolor sit amet, ea detracto legendos imperdiet mel, ius ne noster graecis minimum. Ex usu animal officiis, nam unum mediocritatem ei. Aliquip definiebas nec et, ius te mutat bonorum, at eos ferri veritus adversarium. Cu quo alterum scribentur, fastidii detracto adolescens his ne. Id eum idque moderatius deterruisset.
                                              Audire deleniti voluptatibus no mea, ea discere perpetua iracundia vis. Natum salutandi ut quo. Pertinax principes disputationi an quo, eam vulputate adipiscing ei, justo facilis omnesque eos id. Cu nominati molestiae efficiendi usu. Ea duo habeo feugiat adipisci.
                                              Causae persecuti eum et. Ne scribentur delicatissimi eam, cu pri vero laboramus voluptaria. Bonorum argumentum eum cu, tantas deterruisset vim ea. Duo quod decore pericula et, ea his primis eruditi. At mazim albucius eligendi eos.
                                              Ea pro quidam tractatos, per iudico laoreet no, lucilius tacimates et usu. Duo ne amet senserit, has at illud voluptaria, nibh probatus ut vim. Tota idque nullam ne has, in error eloquentiam nec, usu ferri pertinacia efficiendi cu. Cetero alterum liberavisse vim an, accumsan qualisque constituam ad eos, his et erant graeci. Eos ea quando partem nominavi.
                                              Sea cibo suscipiantur te. Eu atqui clita mei. Cum ut dolorum abhorreant. Nec inani menandri ex, habeo menandri nec ut.
      </p>
    </div>
  );
}

export default Works;
