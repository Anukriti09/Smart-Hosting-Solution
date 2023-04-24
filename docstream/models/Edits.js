import React, { useEffect } from 'react'

const Edits = ({ updates, setOverlay, toggleBlack, setShowEdits }) => {
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
                }
                transformedFromDocuments.push(fromDocument)
                transformedToDocuments.push(toDocument)
            })
            res()
        })
    }

    useEffect(async () => {
        await okay()
    }, []);
    return (
        <div id='style-2' className={`editsContainer ${toggleBlack ? 'editsContainer-dark' : ''}`}>
            <div className="editsHeader">
                <h1>Edits</h1>
                <button className={`button ${toggleBlack ? "button-dark" : ""}`} onClick={() => { setOverlay(false); setShowEdits(false) }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.83582 5.00012L14.8357 14.6716" stroke-width="4" stroke-linecap="round" />
                        <path d="M14.5075 4.67163L4.83569 14.6716" stroke-width="4" stroke-linecap="round" />
                    </svg>
                </button>
            </div>
            {
                updates.map((ele, index) => {
                    return (
                        <div className='indiEditContainer' key={index}>
                            <h2>By: {ele.sender}</h2>
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