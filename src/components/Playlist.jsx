import React from 'react'

export default function Playlist({ playlist, onRemove, onMove, onShare, onClear, page, setPage }) {
  const perPage = 10
  const total = playlist.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page-1)*perPage
  const pageItems = playlist.slice(start, start+perPage)
  return (
    <div>
      <div className="playlistHeader">
        <h3>🎵 我的歌单</h3>
        <div className="topActions">
          <button onClick={onShare}>🔗 分享</button>
          <button onClick={onClear}>清空</button>
        </div>
      </div>
      <div className="count">共 {total} 首</div>
      <div className="playlistList">
        {pageItems.length===0 && <div className="hint">歌单为空 — 点击“＋加入歌单”把歌曲放进来</div>}
        {pageItems.map((p,i)=>(
          <div className="plItem" key={p.trackId} draggable>
            <div className="plLeft">
              <div className="idx">{start + i + 1}.</div>
              <img src={p.artworkUrl100} alt="" />
              <div className="plInfo">
                <div className="t">{p.trackName}</div>
                <div className="a">{p.artistName}</div>
              </div>
            </div>
            <div className="plBtns">
              <button onClick={()=>onMove(start + i, -1)}>↑</button>
              <button onClick={()=>onMove(start + i, 1)}>↓</button>
              <button onClick={()=>onRemove(p.trackId)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pager">
        <button onClick={()=>setPage(Math.max(1, page-1))} disabled={page<=1}>上一页</button>
        <span> 第 {page} / {totalPages} 页 </span>
        <button onClick={()=>setPage(Math.min(totalPages, page+1))} disabled={page>=totalPages}>下一页</button>
      </div>
    </div>
  )
}
