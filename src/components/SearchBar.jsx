import React from 'react'

export default function SearchBar({ term, setTerm, onSearch, onRefresh, loading }) {
  return (
    <div className="searchRow stickyTop" onMouseDown={e=>e.stopPropagation()}>
      <input
        placeholder="搜索歌手或歌曲..."
        value={term}
        onChange={e=>setTerm(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter') onSearch(term) }}
      />
      <button onClick={()=>onSearch(term)} disabled={loading}>{loading ? '搜索中...' : '搜索'}</button>
      <button className="refreshBtn" onClick={onRefresh}>🔄</button>
    </div>
  )
}
