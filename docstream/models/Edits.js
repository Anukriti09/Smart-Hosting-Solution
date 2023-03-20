import React, { useEffect } from 'react'
import 'react-quill/dist/quill.snow.css';




const Edits = ({updates}) => {
    console.log(updates)
    let transformedFromDocuments = []
    let transformedToDocuments = []
    

    useEffect(async () => {
        if (document === 'undefined') return
        const Quill = (await import("quill")).default;
        updates.forEach((ele,index) => {
            let fromDocument = new Quill(`.from-${index}`, {
                modules: {
                    toolbar: false
                },
                readOnly: true
            })
            let toDocument = new Quill(`.to-${index}`, {
                modules: {
                    toolbar: false
                },
                readOnly: true
            })
            fromDocument.setContents(ele.original)
            toDocument.setContents(ele.original)
            for(let i = 0; i < ele.changes.length; i++){
                toDocument.updateContents(ele.changes[i])
            }
            transformedFromDocuments.push(fromDocument)
            transformedToDocuments.push(toDocument)
        })
      }, []);

    return (
        <div className='editsContainer'>
        {
            updates.map((ele, index) => {
                return(
                    <div className='indiEditContainer' key={index}>
                        <h2>Edit By: {ele.sender}</h2>
                        <div className='indiEdit'>
                            <div className={`from from-${index}`}></div>
                            <p>To</p>
                            <div className={`to to-${index}`}></div>
                        </div>
                    </div>
                )
            })
        }
        
    </div>

    )
}

export default Edits