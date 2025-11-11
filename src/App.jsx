import React, { useEffect, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import SongList from './components/SongList'
import Playlist from './components/Playlist'
import ArtistGrid from './components/ArtistGrid'

const famous = [
  "Taylor Swift","Ed Sheeran","Adele","Beyoncé","Coldplay","Drake","Rihanna","Bruno Mars","Katy Perry","Lady Gaga",
  "Justin Bieber","The Weeknd","Ariana Grande","Shawn Mendes","Billie Eilish","Imagine Dragons","Maroon 5","Sam Smith",
  "John Legend","Metallica","Eminem","Kendrick Lamar","Post Malone","Dua Lipa","Lana Del Rey","Olivia Rodrigo","Sia",
  "P!nk","Linkin Park","Backstreet Boys","NSYNC","Coldplay","U2","Queen","Elton John","Madonna","Whitney Houston",
  "Celine Dion","Alicia Keys","Jay Chou","周杰伦","林俊杰","王力宏","张学友","林宥嘉","王菲","邓紫棋","陈奕迅","Beyond"
]

export default function App(){
  const [songs, setSongs] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [notice, setNotice] = useState('')
  const [artists, setArtists] = useState([])
  const [page, setPage] = useState(1)

  useEffect(()=>{
    const saved = localStorage.getItem('musiclist_v4_playlist')
    if(saved) { try{ setPlaylist(JSON.parse(saved)) }catch{} }
    const shuffled = [...famous].sort(()=>0.5 - Math.random()).slice(0,50)
    setArtists(shuffled)
    const params = new URLSearchParams(window.location.search)
    const listParam = params.get('list')
    if(listParam){
      const ids = listParam.split(',').filter(Boolean)
      if(ids.length) fetchSongsByIds(ids)
    }
  },[])

  useEffect(()=>{ localStorage.setItem('musiclist_v4_playlist', JSON.stringify(playlist)) },[playlist])

  async function fetchSongsByIds(ids){
    setLoading(true)
    const out = []
    for(const id of ids){
      try{
        const res = await fetch(`https://itunes.apple.com/lookup?id=${id}`)
        const j = await res.json()
        if(j.results && j.results.length) out.push(j.results[0])
      }catch(e){}
    }
    setPlaylist(out)
    setLoading(false)
  }

  async function doSearch(term){
    if(!term) return
    setLoading(true)
    setNotice('')
    setSongs([])
    const limit = 50
    const maxPages = 4
    let all = []
    for(let i=0;i<maxPages;i++){
      try{
        const offset = i*limit
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${limit}&offset=${offset}`)
        const j = await res.json()
        if(j.results && j.results.length){
          all = all.concat(j.results)
          if(j.results.length < limit) break
        } else break
      }catch(e){ break }
    }
    if(all.length > 200){ all = all.slice(0,200); setNotice('结果超过 200 首，只显示前 200 首。') }
    if(all.length === 0) setNotice('未找到相关歌曲。')
    setSongs(all)
    setLoading(false)
    setPage(1)
  }

  function refreshHome(){
    setSongs([])
    setSearchTerm('')
    setNotice('')
    const shuffled = [...famous].sort(()=>0.5 - Math.random()).slice(0,50)
    setArtists(shuffled)
  }

  function addToPlaylist(track){
    if(playlist.find(p=>p.trackId===track.trackId)){ alert('这首歌已在你的歌单中！'); return }
    setPlaylist(p=>[...p, track])
  }

  function removeFromPlaylist(trackId){
    setPlaylist(p=>p.filter(x=>x.trackId!==trackId))
  }

  function move(index, dir){
    setPlaylist(p=>{
      const copy = [...p]
      const to = index+dir
      if(to<0||to>=copy.length) return copy
      const [it] = copy.splice(index,1)
      copy.splice(to,0,it)
      return copy
    })
  }

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="logoWrap"><div className="logoCircle">🎵</div><div className="title">你的专属歌单中心</div></div>
      </header>

      <div className="content">
        <main className="left">
          <SearchBar term={searchTerm} setTerm={setSearchTerm} onSearch={doSearch} onRefresh={refreshHome} loading={loading} />
          {artists && artists.length>0 && songs.length===0 && <ArtistGrid artists={artists} onPick={(a)=>{ setSearchTerm(a); doSearch(a); }} />}
          <div className="results">
            {notice && <div className="notice">{notice}</div>}
            <SongList songs={songs} onAdd={addToPlaylist} />
          </div>
        </main>

        <aside className="right">
          <Playlist playlist={playlist} onRemove={removeFromPlaylist} onMove={move} onShare={()=>{
            if(!playlist.length){ alert('歌单为空'); return }
            const ids = playlist.map(s=>s.trackId).join(',')
            const url = `${window.location.origin}${window.location.pathname}?list=${ids}`
            navigator.clipboard.writeText(url).then(()=>alert('分享链接已复制'))
          }} onClear={()=>{
            if(confirm('确认清空歌单？')){ setPlaylist([]); localStorage.removeItem('musiclist_v4_playlist') }
          }} page={page} setPage={setPage} />
        </aside>
      </div>
    </div>
  )
}
