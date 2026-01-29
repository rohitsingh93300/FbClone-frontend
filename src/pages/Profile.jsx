import React, { useEffect, useRef, useState } from 'react'
import emptyCover from "../assets/emptyCover.jpg"
import { Button } from '@/components/ui/button'
import { FaCamera } from 'react-icons/fa'
import userLogo from "../assets/user.jpg"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, Images, SquareUser } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MdDashboard } from 'react-icons/md'
import axios from 'axios'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser, setUserProfile } from '@/redux/authSlice'
import { toast } from 'sonner'

const Profile = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const { loading, user, userProfile } = useSelector(store => store.auth)
  const coverPhoto = userProfile.coverPhoto || emptyCover
  const profileRef = useRef()
  const coverRef = useRef()

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`https://fb-clone-backend-dun.vercel.app/api/v1/auth/profile/${params.id}`)
      if (res.data.success) {
        dispatch(setUserProfile(res.data.user))
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData()
    formData.append("file", file);

    try {
      dispatch(setLoading(true))
      const res = await axios.put(`https://fb-clone-backend-dun.vercel.app/api/v1/auth/update/profile-pic`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      })
      if (res.data.success) {
        toast.success(res.data.message);
        const profilePicture = res.data.profilePicture
        dispatch(setUser({ ...user, profilePicture }))
        dispatch(setUserProfile({ ...userProfile, profilePicture }))
      }
    } catch (error) {
      console.error("Error uploading profile picture", error)
    } finally {
      dispatch(setLoading(false))
    }
  }
  const handleCoverPicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData()
    formData.append("file", file);

    try {
      dispatch(setLoading(true))
      const res = await axios.put(`https://fb-clone-backend-dun.vercel.app/api/v1/auth/update/cover-pic`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      })
      if (res.data.success) {
        toast.success(res.data.message);
        const coverPhoto = res.data.coverPhoto
        dispatch(setUser({ ...user, coverPhoto }))
        dispatch(setUserProfile({ ...userProfile, coverPhoto }))
      }
    } catch (error) {
      console.error("Error uploading cover picture", error)
    } finally {
      dispatch(setLoading(false))
    }
  }



  useEffect(() => {
    fetchUserProfile()
  }, [])
  return (
    <div className='min-h-screen'>
      {
        loading && (
          <div className='fixed inset-0 z-[99999] bg-black/30 backdrop-blur-sm flex items-center justify-center'>
            <div className='text-white text-xl font-semibold animate-pulse'>
              Uploading...
            </div>
          </div>
        )
      }
      <div className='relative w-full'>

        {/* Blurred background */}
        <div className='absolute inset-0 bg-center bg-cover filter'
          style={{ backgroundImage: `url(${coverPhoto})` }}>
        </div>
        {/* overlay to darken the blur */}
        <div className='absolute inset-0 bg-black/40 backdrop-blur-lg bg-gradient-to-b from-transparent dark:to-[#262829] to-white'></div>
        {/* Actual cover image */}
        <div className='relative flex justify-center items-center'>
          <img src={coverPhoto} alt="cover" className='rounded-lg w-6xl h-[300px] md:h-[450px] object-cover' />
          <input type="file" className='hidden' ref={coverRef} onChange={handleCoverPicChange} />
          <Button onClick={() => coverRef?.current.click()} className="absolute right-3 md:right-52 cursor-pointer bottom-3 flex gap-2 items-center bg-white text-gray-800 hover:bg-gray-100"><FaCamera /><span>Edit cover photo</span></Button>
        </div>
      </div>
      <div className='dark:bg-[#262829] bg-white z-40 py-4'>
        <div className='max-w-6xl mx-auto md:px-10 px-5 flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between'>
          <div className='flex flex-col md:flex-row md:gap-5 md:items-center relative'>

            <input type="file" className='hidden' ref={profileRef} onChange={handleProfilePicChange} />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img src={userProfile.profilePicture || userLogo} alt="" className='w-44 h-44 cursor-pointer hover:invert-25 rounded-full border-4 border-white dark:border-[#262829] object-cover z-30 -mt-14' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-xs">
                <DropdownMenuItem onClick={() => setOpen(true)}><SquareUser /> See profile picture</DropdownMenuItem>
                <DropdownMenuItem onClick={() => profileRef?.current.click()}><Images /> Choose profile picture</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">Profile Picture</DialogTitle>
                  <hr className='mt-3' />
                </DialogHeader>
                <img src={userProfile?.profilePicture || userLogo} alt="" />
              </DialogContent>
            </Dialog>
            <span className='bg-gray-200 absolute z-40 left-32 cursor-pointer bottom-20 md:bottom-5 dark:bg-[#3a3c3d] p-2 rounded-full'><FaCamera className='h-5 w-5'/></span>
            <div>
              <h1 className='text-3xl font-bold'>Rohit Singh</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-1'>2k followers . 200 following</p>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <Button className='bg-[#0866ff] hover:bg-[#0867ffbe] cursor-pointer text-white'><MdDashboard /> Professional Dashboard</Button>
            <Button className='flex gap-2 items-center bg-[#e1e4e8] hover:bg-[#e1e7ef] cursor-pointer dark:bg-[#3a3c3d] text-gray-800 dark:text-gray-200'><Edit /> Edit</Button>
          </div>
        </div>
        <hr className='mt-5 mb-2 max-w-6xl mx-auto' />
        <div className='flex md:gap-10 max-w-6xl mx-auto md:px-10'>
          <span onClick={() => navigate(`/profile/${userProfile._id}/post`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>Posts</span>
          <span onClick={() => navigate(`/profile/${userProfile._id}/about`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>About</span>
          <span onClick={() => navigate(`/profile/${userProfile._id}/friends`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>Friends</span>
          <span onClick={() => navigate(`/profile/${userProfile._id}/photos`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>Photos</span>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default Profile
