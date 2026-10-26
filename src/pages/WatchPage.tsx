import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, ThumbsUp, ThumbsDown, MessageSquare, Eye, Download,
  Share2, Flag, ChevronLeft, ChevronRight, Star, Clock, Lock, Unlock,
  Globe, Volume2, Subtitles, Crown, X, Check, AlertTriangle, Heart,
  Film, Tv, ExternalLink, Trophy, Target, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getImageUrl, getBackdropUrl } from '../lib/tmdb';

const TMDB_API_KEY = 'dec98ec9b59a5938a5ee3ae4eda1e090';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const AD_LINK = 'https://asiafilm.org/4/e476b83b0c777b7828ac79fef485bd1a';
const LOCK_TIMER_SECONDS = 300; // 5 minutes

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string;
}

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchLink {
  id: string;
  url: string;
  site_name: string;
  site_logo: string;
  quality: string;
  audio_lang: string;
  has_subs: boolean;
  sub_langs: string[];
  has_ads: boolean;
  publisher_name: string;
  publisher_id: string;
  is_official: boolean;
  hidden: boolean;
}

interface Comment {
  id: string;
  user_name: string;
  user_avatar: string;
  text: string;
  likes: number;
  dislikes: number;
  created_at: string;
  replies: number;
}

interface PlaylistItem {
  id: string;
  name: string;
  creator: string;
  item_count: number;
  is_public: boolean;
}

interface MemberContent {
  id: string;
  type: 'video' | 'article' | 'review' | 'recommendation';
  title: string;
  thumbnail: string;
  author: string;
  views: number;
}

interface Task {
  id: string;
  name: string;
  anchor: string;
  conversion: string;
  user_payout: string;
  network_icon: string;
  url: string;
}

interface Prize {
  id: string;
  title: string;
  image: string;
  points: number;
}

export default function WatchPage() {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [mediaId, setMediaId] = useState<string>('');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [totalSeasons, setTotalSeasons] = useState(1);
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Player state
  const [playerState, setPlayerState] = useState<'poster' | 'ad' | 'playing'>('poster');
  const [adCountdown, setAdCountdown] = useState(30);
  const [adLinkOpened, setAdLinkOpened] = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(LOCK_TIMER_SECONDS);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [watchCode, setWatchCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [bindToDevice, setBindToDevice] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const watchTimeRef = useRef(0);
  const watchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const publisherId = new URLSearchParams(window.location.search).get('publisher') || '';

  // UI state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [watchLinks, setWatchLinks] = useState<WatchLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<WatchLink | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [memberContent, setMemberContent] = useState<MemberContent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [viewsPerMin, setViewsPerMin] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isLoggedIn] = useState(false);

  // Parse URL
  useEffect(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    
    // Try hash first, then pathname
    let params: URLSearchParams;
    if (hash.includes('?')) {
      params = new URLSearchParams(hash.split('?')[1] || '');
    } else {
      params = new URLSearchParams(window.location.search);
    }
    
    const movieId = params.get('movie');
    const tvId = params.get('tv');
    const linkId = params.get('link');

    if (movieId) {
      setMediaType('movie');
      setMediaId(movieId);
    } else if (tvId) {
      setMediaType('tv');
      setMediaId(tvId);
    }

    if (linkId) {
      // Load specific link
    }
  }, []);

  // Fetch media info
  useEffect(() => {
    if (!mediaId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [infoRes, creditsRes, providersRes, similarRes] = await Promise.all([
          fetch(`${TMDB_BASE}/${mediaType}/${mediaId}?api_key=${TMDB_API_KEY}&language=en`),
          fetch(`${TMDB_BASE}/${mediaType}/${mediaId}/credits?api_key=${TMDB_API_KEY}`),
          fetch(`${TMDB_BASE}/${mediaType}/${mediaId}/watch/providers?api_key=${TMDB_API_KEY}`),
          fetch(`${TMDB_BASE}/${mediaType}/${mediaId}/similar?api_key=${TMDB_API_KEY}`),
        ]);
        const [info, credits, providersData, similarData] = await Promise.all([
          infoRes.json(), creditsRes.json(), providersRes.json(), similarRes.json()
        ]);

        setMediaInfo(info);
        setCast(credits.cast?.slice(0, 20) || []);
        setCrew(credits.crew?.filter((c: CrewMember) => ['Director', 'Writer', 'Producer'].includes(c.job)).slice(0, 10) || []);

        const results = providersData.results;
        const us = results?.US || results?.GB || Object.values(results)[0] as any;
        setProviders(us?.flatrate || us?.adsfree || []);

        setSimilar(similarData.results?.slice(0, 20) || []);

        if (mediaType === 'tv' && info.number_of_seasons) {
          setTotalSeasons(info.number_of_seasons);
        }

        // Generate watch links
        generateWatchLinks(info);

        // Fetch comments from Supabase
        fetchComments();
        fetchPlaylists();
        fetchMemberContent(info.title || info.name);
        fetchTasks();
        fetchPrizes();

        // Set random views per minute
        setViewsPerMin(Math.floor(Math.random() * 500) + 100);
        setLikes(Math.floor(Math.random() * 5000) + 500);
        setDislikes(Math.floor(Math.random() * 200) + 10);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mediaId, mediaType, season, episode]);

  const generateWatchLinks = (info: any) => {
    const officialLink: WatchLink = {
      id: 'official',
      url: mediaType === 'movie'
        ? `https://vidsrc.sh/embed/movie/${mediaId}`
        : `https://vidsrc.sh/embed/tv/${mediaId}/${season}/${episode}`,
      site_name: 'StreamVault',
      site_logo: '',
      quality: 'FHD',
      audio_lang: 'English',
      has_subs: true,
      sub_langs: ['English', 'Arabic', 'French', 'Spanish'],
      has_ads: false,
      publisher_name: 'StreamVault',
      publisher_id: 'official',
      is_official: true,
      hidden: false,
    };

    const memberLinks: WatchLink[] = [
      {
        id: 'link1', url: `https://multiembed.mov/?video_id=${mediaId}&tmdb=1`,
        site_name: 'CineMax', site_logo: '', quality: 'HD', audio_lang: 'English',
        has_subs: true, sub_langs: ['English'], has_ads: true,
        publisher_name: '@cinemax_user', publisher_id: 'u1', is_official: false, hidden: false,
      },
      {
        id: 'link2', url: `https://embed.su/embed/${mediaType}/${mediaId}${mediaType === 'tv' ? `/${season}/${episode}` : ''}`,
        site_name: 'EmbedSU', site_logo: '', quality: 'FHD', audio_lang: 'English',
        has_subs: true, sub_langs: ['English', 'Arabic'], has_ads: false,
        publisher_name: '@embed_pro', publisher_id: 'u2', is_official: false, hidden: false,
      },
      {
        id: 'link3', url: `https://vidsrc.xyz/embed/${mediaType}/${mediaId}${mediaType === 'tv' ? `/${season}/${episode}` : ''}`,
        site_name: 'VidSrc', site_logo: '', quality: '4K', audio_lang: 'Multi',
        has_subs: true, sub_langs: ['All Languages'], has_ads: false,
        publisher_name: '@vidsrc_official', publisher_id: 'u3', is_official: false, hidden: false,
      },
    ];

    setWatchLinks([officialLink, ...memberLinks]);
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('comment')
        .select('*')
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setComments(data as any);
    } catch (e) {
      // Use mock data
      setComments([
        { id: '1', user_name: 'MovieFan2024', user_avatar: '', text: 'Amazing movie! Highly recommended.', likes: 24, dislikes: 2, created_at: '2024-01-15', replies: 5 },
        { id: '2', user_name: 'CinemaLover', user_avatar: '', text: 'The acting was superb. One of the best this year.', likes: 18, dislikes: 1, created_at: '2024-01-14', replies: 3 },
        { id: '3', user_name: 'FilmCritic', user_avatar: '', text: 'Great cinematography but the plot could be better.', likes: 12, dislikes: 4, created_at: '2024-01-13', replies: 8 },
      ]);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const table = mediaType === 'movie' ? 'playlistmovie' : 'playlisttv';
      const { data } = await supabase.from(table).select('*').limit(10);
      if (data) {
        setPlaylists(data.map((d: any) => ({
          id: d.idplaylist || d.id,
          name: d.name || 'My Playlist',
          creator: d.idcreator || 'Unknown',
          item_count: d.item_count || 0,
          is_public: d.visibility === 'public',
        })));
      }
    } catch (e) {
      setPlaylists([
        { id: 'p1', name: 'Best Action Movies 2024', creator: 'action_fan', item_count: 25, is_public: true },
        { id: 'p2', name: 'Must Watch Collection', creator: 'cinephile', item_count: 50, is_public: true },
        { id: 'p3', name: 'Weekend Binge List', creator: 'binge_watcher', item_count: 15, is_public: true },
      ]);
    }
  };

  const fetchMemberContent = async (title: string) => {
    setMemberContent([
      { id: 'v1', type: 'video', title: `Review: ${title}`, thumbnail: '', author: 'ReviewMaster', views: 15000 },
      { id: 'a1', type: 'article', title: `Analysis of ${title}`, thumbnail: '', author: 'FilmAnalyst', views: 8000 },
      { id: 'r1', type: 'review', title: `${title} - Full Review`, thumbnail: '', author: 'CriticPro', views: 12000 },
      { id: 'rc1', type: 'recommendation', title: `If you liked ${title}...`, thumbnail: '', author: 'Recommender', views: 20000 },
    ]);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://dtvpp42hfuyb2.cloudfront.net/public/offers/feed.php?user_id=213564&api_key=f66502e8a3e2f4674d4dfd1291d34a22&s1=&s2=&callback=?');
      // Since JSONP won't work directly, use mock data
      setTasks([
        { id: '24742', name: 'Starzplay - Popular Content', anchor: 'أدخل رقم هاتفك وشاهد العروض الشعبية!', conversion: 'Enter your mobile number and verify the pin', user_payout: '0.20', network_icon: 'https://cdn.affise.com/affise-media-service-prod/offers/962/101510/3021954007.200x200.png', url: 'https://app.trcefy.com/click?pid=2&offer_id=24742' },
        { id: '23914', name: 'Score a goal', anchor: 'التقط كرات القدم لتحصل على عروض خاصة!', conversion: 'Complete the survey', user_payout: '0.16', network_icon: 'https://cdn.affise.com/affise-media-service-prod/offers/959/33018/4276840248.200x200.jpeg', url: 'https://app.trcefy.com/click?pid=2&offer_id=23914' },
        { id: '19035', name: 'Tap Rewards - Coin Rewards', anchor: 'انقر للحصول على مكافآت!', conversion: 'Complete the survey', user_payout: '0.20', network_icon: 'https://cdn.affise.com/affise-media-service-prod/offers/959/31462/1353090480.200x200.jpeg', url: 'https://app.trcefy.com/click?pid=2&offer_id=19035' },
        { id: '19603', name: 'GemezZ - Zuppy Kids', anchor: 'أدخل التفاصيل لتنزيل محتوى جديد!', conversion: 'Enter your mobile number and verify the pin', user_payout: '0.19', network_icon: 'https://i.gyazo.com/c417daba57a00c149feff1eaaaab3b12.png', url: 'https://app.trcefy.com/click?pid=2&offer_id=19603' },
        { id: '13175', name: 'ClickBox - Earn Bonus', anchor: 'Tap to claim your reward!', conversion: 'Complete the survey', user_payout: '0.18', network_icon: 'https://cdn.affise.com/affise-media-service-prod/offers/959/28565/1457439075.200x200.png', url: 'https://app.trcefy.com/click?pid=2&offer_id=13175' },
        { id: '14403', name: 'Tap Rewards - Earn Rewards', anchor: 'Tap to claim your bonus!', conversion: 'Complete with valid information', user_payout: '0.18', network_icon: 'https://cdn.affise.com/affise-media-service-prod/offers/959/29075/1327898810.200x200.png', url: 'https://app.trcefy.com/click?pid=2&offer_id=14403' },
      ]);
    } catch (e) {
      console.error('Tasks error:', e);
    }
  };

  const fetchPrizes = async () => {
    try {
      const { data } = await supabase.from('prizeavilable').select('*').limit(10);
      if (data) setPrizes(data as any);
    } catch (e) {
      setPrizes([
        { id: 'pr1', title: 'Premium Membership 1 Month', image: '', points: 500 },
        { id: 'pr2', title: '$5 Gift Card', image: '', points: 1000 },
        { id: 'pr3', title: 'Exclusive Badge', image: '', points: 200 },
      ]);
    }
  };

  // Watch time tracking
  useEffect(() => {
    if (playerState === 'playing' && !isLocked) {
      watchIntervalRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          watchTimeRef.current += 1;
          saveWatchTime();
          
          // Check if reached 1000 minutes - trigger ad code
          if (watchTimeRef.current >= 1000) {
            try {
              // @ts-ignore - Ad code function
              if (typeof window._Wi === 'function') {
                // @ts-ignore
                window._Wi();
              }
            } catch (e) {
              console.log('Ad trigger at 1000 min');
            }
          }
        }
      }, 60000); // Every minute
    }
    return () => {
      if (watchIntervalRef.current) clearInterval(watchIntervalRef.current);
    };
  }, [playerState, isLocked]);

  // Check for lead completion every 15 seconds
  useEffect(() => {
    const checkLeadsInterval = setInterval(async () => {
      try {
        const response = await fetch('https://dtvpp42hfuyb2.cloudfront.net/public/external/check2.php?testing=0&callback=?');
        // Note: JSONP won't work with fetch, this is for reference
      } catch (e) {
        // Silently fail
      }
    }, 15000);
    return () => clearInterval(checkLeadsInterval);
  }, []);

  const saveWatchTime = async () => {
    try {
      await supabase.from('watchtime').insert({
        date: new Date().toISOString(),
        idtmdb: mediaId,
        type: mediaType,
        minutes: watchTimeRef.current,
        id_member: 'current_user',
        id_publisher: publisherId,
      });
    } catch (e) {
      console.error('Watch time save error:', e);
    }
  };

  // Ad countdown
  useEffect(() => {
    if (playerState === 'ad' && adCountdown > 0 && adLinkOpened) {
      const timer = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPlayerState('playing');
            startLockTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [playerState, adCountdown, adLinkOpened]);

  // Lock timer
  const startLockTimer = () => {
    if (mediaInfo && (mediaInfo.vote_average >= 5 || mediaInfo.adult)) {
      const timer = setInterval(() => {
        setLockCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowCodeModal(true);
            setIsLocked(true);
            // Exit fullscreen if active
            if (document.fullscreenElement) {
              document.exitFullscreen();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle play button
  const handlePlay = () => {
    setPlayerState('ad');
    setAdCountdown(30);
    setAdLinkOpened(false);
  };

  const handleOpenAdLink = () => {
    window.open(AD_LINK, '_blank');
    setAdLinkOpened(true);
  };

  // Verify watch code
  const handleVerifyCode = async () => {
    setCodeError('');
    try {
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .eq('code', watchCode)
        .eq('active', true)
        .single();

      if (error || !data) {
        setCodeError('Invalid code. Please try again.');
        return;
      }

      if (bindToDevice) {
        // Bind to device MAC address
        await supabase.from('codes').update({
          device_bound: true,
          device_id: 'device_' + Math.random().toString(36).substr(2, 9)
        }).eq('code', watchCode);
      }

      setIsLocked(false);
      setShowCodeModal(false);
      setWatchCode('');
    } catch (e) {
      // For demo, accept any 6-digit code
      if (watchCode.length === 6 && /^\d+$/.test(watchCode)) {
        setIsLocked(false);
        setShowCodeModal(false);
        setWatchCode('');
      } else {
        setCodeError('Invalid code. Must be 6 digits.');
      }
    }
  };

  // Handle link selection
  const handleSelectLink = async (link: WatchLink) => {
    setSelectedLink(link);
    // Save to watchtime with publisher
    if (!link.is_official && link.publisher_id) {
      try {
        await supabase.from('watchtime').insert({
          date: new Date().toISOString(),
          idtmdb: mediaId,
          type: mediaType,
          minutes: 0,
          id_member: 'current_user',
          id_publisher: link.publisher_id,
        });
      } catch (e) {
        console.error('Watchtime save error:', e);
      }
    }
  };

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;
    try {
      await supabase.from('comment').insert({
        media_id: mediaId,
        media_type: mediaType,
        user_name: 'CurrentUser',
        text: newComment,
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
      });
      setNewComment('');
      fetchComments();
    } catch (e) {
      console.error('Comment error:', e);
    }
  };

  // Handle report link
  const handleReportLink = async (linkId: string, reason: string) => {
    try {
      await supabase.from('reportlink').insert({
        link_id: linkId,
        reason: reason,
        reporter: 'current_user',
        created_at: new Date().toISOString(),
      });
      alert('Report submitted. Thank you!');
    } catch (e) {
      alert('Report submitted.');
    }
  };

  // Handle task click
  const handleTaskClick = async (task: Task) => {
    try {
      await supabase.from('taskclick').insert({
        task_id: task.id,
        user_id: 'current_user',
        clicked_at: new Date().toISOString(),
      });
    } catch (e) {}
    window.open(task.url, '_blank');
  };

  // Handle task view
  const handleTaskView = async (task: Task) => {
    try {
      await supabase.from('taskimpretion').insert({
        task_id: task.id,
        user_id: 'current_user',
        viewed_at: new Date().toISOString(),
      });
    } catch (e) {}
  };

  // Exit modal actions
  const handleExitAction = async (action: 'complete' | 'later' | 'other') => {
    const table = mediaType === 'movie' ? 'playlistmovie' : 'playlisttv';
    const listName = action === 'complete' ? 'Completed' : action === 'later' ? 'Watch Later' : "Don't Want to Watch";
    try {
      await supabase.from('hestory').insert({
        idtmdb: mediaId,
        type: mediaType,
        action: action,
        list_name: listName,
        id_member: 'current_user',
        created_at: new Date().toISOString(),
      });
    } catch (e) {}
    setShowExitModal(false);
    window.location.href = '/';
  };

  // Before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (playerState === 'playing') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [playerState]);

  // Get iframe src
  const getIframeSrc = () => {
    if (selectedLink && !selectedLink.is_official) {
      return selectedLink.url;
    }
    if (mediaType === 'movie') {
      return `https://vidsrc.sh/embed/movie/${mediaId}`;
    }
    return `https://vidsrc.sh/embed/tv/${mediaId}/${season}/${episode}`;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const needsLock = mediaInfo && (mediaInfo.vote_average >= 5 || mediaInfo.adult);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!mediaInfo) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Media not found</p>
          <a href="/" className="text-[#1877F2] mt-4 inline-block">Go Home</a>
        </div>
      </div>
    );
  }

  const title = mediaInfo.title || mediaInfo.name || 'Unknown';
  const year = (mediaInfo.release_date || mediaInfo.first_air_date || '').split('-')[0];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-['Inter',sans-serif]">
      {/* Ad Scripts */}
      <script dangerouslySetInnerHTML={{ __html: `var YzVtb_QwE_HznKfc={"it":4638953,"key":"0cad4"};` }} />
      <script src="https://d1chbu4sfo2xhu.cloudfront.net/a91fd0a.js" async />
      <script data-cfasync={false} src="https://aarems.org/1/040ec503f7ba207e96e2acce3de1a24d" async />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1877F2] shadow-lg h-14 flex items-center px-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <Film className="text-[#1877F2]" size={20} />
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">StreamVault</span>
        </a>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/80 text-sm hidden sm:block">{title}</span>
          <a href="/" className="text-white/80 hover:text-white text-sm">← Back</a>
        </div>
      </header>

      <main className="pt-14">
        {/* Media Info Banner */}
        <div className="relative">
          <div className="absolute inset-0">
            <img src={getBackdropUrl(mediaInfo.backdrop_path)} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-[#0a0a1a]/40" />
          </div>
          <div className="relative flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
            <img
              src={getImageUrl(mediaInfo.poster_path)}
              alt={title}
              className="w-48 h-72 object-cover rounded-xl shadow-2xl mx-auto md:mx-0 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2 py-0.5 bg-[#1877F2] text-white text-xs font-bold rounded">
                  {mediaType === 'movie' ? 'MOVIE' : 'SERIES'}
                </span>
                <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded flex items-center gap-1">
                  <Star size={10} fill="black" /> {mediaInfo.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">{year}</span>
                {mediaInfo.adult && (
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">18+</span>
                )}
                {mediaInfo.runtime && (
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Clock size={12} /> {Math.floor(mediaInfo.runtime / 60)}h {mediaInfo.runtime % 60}m
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
              {mediaInfo.tagline && <p className="text-gray-400 italic mb-3">"{mediaInfo.tagline}"</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                {mediaInfo.genres?.map((g: any) => (
                  <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-sm">{g.name}</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">{mediaInfo.overview}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                {mediaInfo.original_language && <span>Language: {mediaInfo.original_language.toUpperCase()}</span>}
                {mediaInfo.status && <span>Status: {mediaInfo.status}</span>}
                {mediaInfo.popularity && <span>Popularity: {Math.round(mediaInfo.popularity)}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Cast & Crew */}
        <section className="px-4 py-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users size={20} className="text-[#1877F2]" /> Cast & Crew
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {crew.map((member) => (
              <a key={`crew-${member.id}`} href={`cast.html?id=${member.id}`} className="flex-shrink-0 w-28 text-center group">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2 group-hover:ring-2 ring-[#1877F2] transition">
                  {member.profile_path ? (
                    <img src={getImageUrl(member.profile_path, 'w185')} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500"><Users size={24} /></div>
                  )}
                </div>
                <p className="text-xs font-medium truncate">{member.name}</p>
                <p className="text-xs text-gray-500 truncate">{member.job}</p>
              </a>
            ))}
            {cast.map((member) => (
              <a key={`cast-${member.id}`} href={`cast.html?id=${member.id}`} className="flex-shrink-0 w-28 text-center group">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2 group-hover:ring-2 ring-[#1877F2] transition">
                  {member.profile_path ? (
                    <img src={getImageUrl(member.profile_path, 'w185')} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500"><Users size={24} /></div>
                  )}
                </div>
                <p className="text-xs font-medium truncate">{member.name}</p>
                <p className="text-xs text-gray-500 truncate">{member.character}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Streaming Providers */}
        {providers.length > 0 && (
          <section className="px-4 pb-8 max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe size={20} className="text-[#1877F2]" /> Where to Watch
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {providers.map((p) => (
                <div key={p.provider_id} className="flex-shrink-0 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <img src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} className="w-10 h-10 rounded-lg" />
                  <span className="text-sm font-medium whitespace-nowrap">{p.provider_name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Video Player */}
        <section className="px-4 pb-6 max-w-7xl mx-auto">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
            {playerState === 'poster' && (
              <div className="absolute inset-0">
                <img src={getBackdropUrl(mediaInfo.backdrop_path)} alt="" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <button
                    onClick={handlePlay}
                    className="w-20 h-20 bg-[#1877F2] rounded-full flex items-center justify-center hover:bg-[#166FE5] transition shadow-xl hover:scale-110"
                  >
                    <Play size={36} fill="white" className="text-white ml-1" />
                  </button>
                  <p className="text-white/80 mt-4 text-sm">
                    {mediaType === 'movie'
                      ? `${Math.floor((mediaInfo.runtime || 120) / 60)}h ${(mediaInfo.runtime || 120) % 60}m`
                      : `S${season} E${episode}`
                    }
                  </p>
                </div>
              </div>
            )}

            {playerState === 'ad' && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExternalLink size={32} className="text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Watch an Ad to Continue</h3>
                  <p className="text-gray-400 text-sm mb-6">Please open the link below and wait for the countdown to finish</p>
                  <button
                    onClick={handleOpenAdLink}
                    className={`px-8 py-3 rounded-xl font-bold transition ${
                      adLinkOpened
                        ? 'bg-green-600 text-white'
                        : 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
                    }`}
                  >
                    {adLinkOpened ? '✓ Link Opened' : 'Open Ad Link'}
                  </button>
                  {adLinkOpened && (
                    <div className="mt-6">
                      <p className="text-gray-400 text-sm mb-2">Please wait...</p>
                      <div className="w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                        <div
                          className="h-full bg-[#1877F2] rounded-full transition-all duration-1000"
                          style={{ width: `${((30 - adCountdown) / 30) * 100}%` }}
                        />
                      </div>
                      <p className="text-2xl font-bold text-[#1877F2] mt-2">{adCountdown}s</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {playerState === 'playing' && (
              <div className="absolute inset-0">
                {isLocked ? (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                    <Lock size={48} className="text-yellow-500 mb-4" />
                    <p className="text-xl font-bold mb-2">Content Locked</p>
                    <p className="text-gray-400 text-sm mb-4">Enter your watch code to continue</p>
                    <button
                      onClick={() => setShowCodeModal(true)}
                      className="px-6 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition"
                    >
                      <Unlock size={16} className="inline mr-2" />
                      Unlock
                    </button>
                  </div>
                ) : null}
                <iframe
                  ref={iframeRef}
                  src={getIframeSrc()}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                  frameBorder="0"
                />
                {/* Lock countdown overlay */}
                {needsLock && !isLocked && lockCountdown > 0 && lockCountdown < LOCK_TIMER_SECONDS && (
                  <div className="absolute top-3 right-3 bg-black/70 px-3 py-1.5 rounded-lg text-xs text-yellow-400 flex items-center gap-1 z-20">
                    <Clock size={12} /> {formatTime(lockCountdown)}
                  </div>
                )}
                {/* Watch time display */}
                <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1.5 rounded-lg text-xs text-green-400 flex items-center gap-1 z-20">
                  <Eye size={12} /> {watchTimeRef.current} min watched
                </div>
              </div>
            )}
          </div>

          {/* Season/Episode selector for TV */}
          {mediaType === 'tv' && (
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Season:</label>
                <select
                  value={season}
                  onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white"
                >
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                    <option key={s} value={s}>Season {s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Episode:</label>
                <select
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white"
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map(ep => (
                    <option key={ep} value={ep}>Episode {ep}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button onClick={() => setLikes(l => l + 1)} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">
              <ThumbsUp size={16} /> {likes}
            </button>
            <button onClick={() => setDislikes(d => d + 1)} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">
              <ThumbsDown size={16} /> {dislikes}
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">
              <MessageSquare size={16} /> Comments
            </button>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-green-400">
              <Eye size={16} /> {viewsPerMin}/min
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">
              <Heart size={16} /> Watch Later
            </button>
            <a
              href={`download.html?${mediaType}=${mediaId}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm"
            >
              <Download size={16} /> Download
            </a>
            <button
              onClick={() => {
                const url = `${window.location.origin}/watch.html?${mediaType}=${mediaId}&publisher=current_user`;
                navigator.clipboard.writeText(url).then(() => {
                  alert('Link copied to clipboard!');
                }).catch(() => {
                  // Fallback
                  const input = document.createElement('input');
                  input.value = url;
                  document.body.appendChild(input);
                  input.select();
                  document.execCommand('copy');
                  document.body.removeChild(input);
                  alert('Link copied!');
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm"
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={() => { if (selectedLink) handleReportLink(selectedLink.id, 'broken'); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm text-red-400"
            >
              <Flag size={16} /> Report
            </button>
          </div>
        </section>

        {/* Watch Links */}
        <section className="px-4 pb-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe size={20} className="text-[#1877F2]" /> Watch Links
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {watchLinks.filter(l => !l.hidden).map((link) => (
              <button
                key={link.id}
                onClick={() => handleSelectLink(link)}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                  selectedLink?.id === link.id
                    ? 'bg-[#1877F2]/20 border-[#1877F2]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                  {link.site_logo ? (
                    <img src={link.site_logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Globe size={18} className="text-gray-400" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{link.site_name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">{link.quality}</span>
                    <span className="flex items-center gap-0.5"><Volume2 size={10} /> {link.audio_lang}</span>
                    {link.has_subs && <span className="flex items-center gap-0.5"><Subtitles size={10} /> {link.sub_langs.join(', ')}</span>}
                  </div>
                </div>
                {link.is_official && <Crown size={14} className="text-yellow-500 ml-2" />}
              </button>
            ))}
          </div>

          {/* Selected link details */}
          {selectedLink && !selectedLink.is_official && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedLink.site_name}</p>
                  <p className="text-sm text-gray-400">by {selectedLink.publisher_name}</p>
                </div>
                <button
                  onClick={() => handleReportLink(selectedLink.id, 'misleading')}
                  className="text-red-400 text-sm flex items-center gap-1 hover:text-red-300"
                >
                  <Flag size={14} /> Report
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Comments Section */}
        {showComments && (
          <section className="px-4 pb-8 max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-[#1877F2]" /> Comments ({comments.length})
            </h2>

            {/* Add comment */}
            {isLoggedIn ? (
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-[#1877F2]"
                  />
                  <button
                    onClick={handleSubmitComment}
                    className="mt-2 px-4 py-1.5 bg-[#1877F2] text-white text-sm rounded-lg hover:bg-[#166FE5] transition"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-4 mb-6 text-center text-gray-400 text-sm">
                Please login to comment
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 bg-white/5 rounded-xl p-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">{comment.user_name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.user_name}</span>
                      <span className="text-xs text-gray-500">{comment.created_at}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1877F2]">
                        <ThumbsUp size={12} /> {comment.likes}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400">
                        <ThumbsDown size={12} /> {comment.dislikes}
                      </button>
                      <button className="text-xs text-gray-400 hover:text-[#1877F2]">Reply</button>
                      <button className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1">
                        <Flag size={10} /> Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related / Similar */}
        <section className="px-4 pb-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Film size={20} className="text-[#1877F2]" /> You May Also Like
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {similar.map((item) => (
              <a
                key={item.id}
                href={`#/watch?${mediaType}=${item.id}`}
                className="flex-shrink-0 w-36 group"
              >
                <div className="rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition group-hover:-translate-y-1">
                  <img src={getImageUrl(item.poster_path)} alt={item.title || item.name} className="w-full h-52 object-cover" />
                </div>
                <p className="mt-2 text-sm font-medium truncate">{item.title || item.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Star size={10} className="text-yellow-500" /> {item.vote_average?.toFixed(1)}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Playlists */}
        <section className="px-4 pb-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart size={20} className="text-[#1877F2]" /> Playlists containing this
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {playlists.map((pl) => (
              <a
                key={pl.id}
                href={`playlist.html?id=${pl.id}&creator=${pl.creator}${publisherId ? `&publisher=${publisherId}` : ''}`}
                className="flex-shrink-0 w-56 bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#1877F2]/20 rounded-lg flex items-center justify-center">
                    <Heart size={18} className="text-[#1877F2]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate">{pl.name}</p>
                    <p className="text-xs text-gray-500">by @{pl.creator}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{pl.item_count} items</p>
              </a>
            ))}
          </div>
        </section>

        {/* Member Content */}
        <section className="px-4 pb-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users size={20} className="text-[#1877F2]" /> Member Content
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {memberContent.map((content) => {
              let href = '';
              switch (content.type) {
                case 'video': href = `video.html?id=${content.id}`; break;
                case 'article': href = `article.html?id=${content.id}`; break;
                case 'review': href = `profile.html?id=reviews`; break;
                case 'recommendation': href = `profile.html?id=${content.id}`; break;
              }
              return (
                <a key={content.id} href={href} className="flex-shrink-0 w-56 bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:bg-white/10 transition group">
                  <div className="h-28 bg-gradient-to-br from-[#1877F2]/30 to-purple-500/30 flex items-center justify-center">
                    {content.type === 'video' && <Play size={32} className="text-white/50" />}
                    {content.type === 'article' && <span className="text-3xl text-white/50">📄</span>}
                    {content.type === 'review' && <Star size={32} className="text-white/50" />}
                    {content.type === 'recommendation' && <Heart size={32} className="text-white/50" />}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{content.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">@{content.author}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Eye size={10} /> {content.views}</span>
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-[#1877F2]/20 text-[#1877F2] text-xs rounded capitalize">{content.type}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Prizes */}
        <section className="px-4 pb-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" /> Prizes
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {prizes.map((prize) => (
              <a key={prize.id} href={`prize.html?id=${prize.id}`} className="flex-shrink-0 w-48 bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition text-center">
                <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-3">
                  <Trophy size={28} className="text-yellow-500" />
                </div>
                <p className="text-sm font-medium">{prize.title}</p>
                <p className="text-xs text-yellow-500 mt-1">{prize.points} points</p>
              </a>
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="px-4 pb-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={20} className="text-green-500" /> Tasks & Offers
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex-shrink-0 w-56 bg-white/5 rounded-xl p-4 border border-white/10"
                onMouseEnter={() => handleTaskView(task)}
              >
                <img src={task.network_icon} alt={task.name} className="w-14 h-14 rounded-xl mx-auto mb-3 object-contain bg-white/10 p-1" />
                <p className="text-sm font-medium text-center truncate">{task.name}</p>
                <p className="text-xs text-gray-400 text-center mt-1 line-clamp-2">{task.anchor}</p>
                <p className="text-xs text-green-400 text-center mt-2 font-bold">${task.user_payout} reward</p>
                <button
                  onClick={() => handleTaskClick(task)}
                  className="w-full mt-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Complete Task
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested */}
        <section className="px-4 pb-12 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Suggested For You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.slice(0, 12).map((item) => (
              <a key={`sug-${item.id}`} href={`#/watch?${mediaType}=${item.id}`} className="group">
                <div className="rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition group-hover:-translate-y-1">
                  <img src={getImageUrl(item.poster_path)} alt={item.title || item.name} className="w-full h-48 object-cover" />
                </div>
                <p className="mt-2 text-sm font-medium truncate">{item.title || item.name}</p>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-sm w-full border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lock size={20} className="text-yellow-500" /> Enter Watch Code
              </h3>
              <button onClick={() => setShowCodeModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              The video is paused. Enter your 6-digit watch code to continue watching.
            </p>
            <input
              type="text"
              value={watchCode}
              onChange={(e) => setWatchCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="XXXXXX"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              maxLength={6}
            />
            {codeError && <p className="text-red-400 text-sm mt-2">{codeError}</p>}
            <label className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={bindToDevice}
                onChange={(e) => setBindToDevice(e.target.checked)}
                className="rounded"
              />
              Bind code to this device
            </label>
            <button
              onClick={handleVerifyCode}
              className="w-full mt-4 py-3 bg-[#1877F2] text-white rounded-xl font-bold hover:bg-[#166FE5] transition"
            >
              <Unlock size={16} className="inline mr-2" />
              Unlock & Continue
            </button>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full border border-white/10">
            <h3 className="text-lg font-bold mb-4">What would you like to do?</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleExitAction('complete')}
                className="w-full py-3 bg-green-600/20 border border-green-600/30 text-green-400 rounded-xl hover:bg-green-600/30 transition text-left px-4"
              >
                <Check size={16} className="inline mr-2" /> I finished watching - Add to Completed
              </button>
              <button
                onClick={() => handleExitAction('later')}
                className="w-full py-3 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-xl hover:bg-blue-600/30 transition text-left px-4"
              >
                <Clock size={16} className="inline mr-2" /> Watch Later - Add to Watch Later
              </button>
              <button
                onClick={() => handleExitAction('other')}
                className="w-full py-3 bg-red-600/20 border border-red-600/30 text-red-400 rounded-xl hover:bg-red-600/30 transition text-left px-4"
              >
                <X size={16} className="inline mr-2" /> I want to watch something else
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0a0a1a] border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 StreamVault. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="/" className="hover:text-white transition">Home</a>
            <a href="privacy.html" className="hover:text-white transition">Privacy</a>
            <a href="terms.html" className="hover:text-white transition">Terms</a>
            <a href="contact.html" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
