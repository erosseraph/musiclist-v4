import React from 'react'

export default function ArtistGrid({ artists, onPick }) {
  if(!artists || artists.length===0) return null
  return (
    <div className="artistGrid">
      {artists.map((a,idx)=>(
        <button key={idx} className="artistBtn" onClick={()=>onPick(a)}>{a}</button>
      ))}
    </div>
  )
}
