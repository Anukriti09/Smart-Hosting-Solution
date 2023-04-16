import React, { useEffect } from 'react'

const Edits = ({ updates }) => {
    let transformedFromDocuments = []
    let transformedToDocuments = []

    let okay = async () => {
        return new Promise(async (res, rej) => {
            if (document === 'undefined') return
            const Quill = (await import("quill")).default;
            updates.forEach((ele, index) => {
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
                for (let i = 0; i < ele.changes.length; i++) {
                    toDocument.updateContents(ele.changes[i], 'silent')
                    console.log(ele.changes[i])
                }
                console.log('done')
                transformedFromDocuments.push(fromDocument)
                transformedToDocuments.push(toDocument)
                console.log(fromDocument.getContents(), toDocument.getContents())
            })
            res()
        })
    }

    useEffect(async () => {
        await okay()
    }, []);
    console.log('cool')
    return (
        <div className='editsContainer'>
            {
                updates.map((ele, index) => {
                    return (
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

export default Edits;