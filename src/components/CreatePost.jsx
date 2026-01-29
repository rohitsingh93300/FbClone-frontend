import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from "../assets/user.jpg"
import { Input } from './ui/input'
import { Image, Smile, Video, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FaEarthAmericas } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import { Textarea } from './ui/textarea'
import { readFileAsDataURL } from '@/lib/utils'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'




const CreatePost = () => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState("")
    const [file, setFile] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const imageRef = useRef()
    const { user } = useSelector(store => store.auth)
    const {posts} = useSelector(store=>store.post)
    const dispatch = useDispatch()

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file)
            setImagePreview(dataUrl)
        }
    }

    const submitHandler = async () => {
        if (!content && !file) {
            toast.error("Post nust have content or an image");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        if (file) formData.append("file", file)
    
            console.log(formData)
        try {
            const res = await axios.post(`https://fb-clone-backend-dun.vercel.app/api/v1/post/create`, formData, {
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true
            })
            if(res.data.success){
                toast.success(res.data.message)
                dispatch(setPosts([...posts, res.data.post]))
                setContent("")
                setFile(null);
                setImagePreview("")
                setOpen(false)
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to post')
    
        }
    }


    return (
        <div className='bg-white dark:bg-[#262829] p-5 rounded-lg w-[600px] md:mt-2'>
            <div className='flex gap-3'>
                <Avatar>
                    <AvatarImage src={user.profilePicture || userLogo} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>


                <Dialog open={open} onOpenChange={setOpen}>
                    <Input onClick={() => setOpen(true)} className='bg-gray-200 cursor-pointer rounded-full text-xl p-5 focus:outline-none focus:ring-0 focus:visible:outline-none'
                        placeholder={`What's on your mind, ${user.firstname}`}
                    />

                    <DialogContent className="sm:max-w-[500px] dark:bg-[#262829]">
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl font-semibold">Create Post</DialogTitle>
                            <hr className='my-2' />
                            <div className='flex gap-3 items-center'>
                                <Avatar>
                                    <AvatarImage src={user.profilePicture || userLogo} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className='font-semibold'>{user.firstname} {user.lastname}</h1>
                                    <div className='bg-gray-200 rounded-lg p-1 px-2 flex gap-1 items-center'>
                                        <FaEarthAmericas className='text-gray-700 w-4 h-4' />
                                        <span className='text-sm'>Public</span>
                                        <TiArrowSortedDown />
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>
                        <Textarea placeholder={`What's on your mind, ${user.firstname}?`} 
                        className='text-xl' 
                        value={content}
                        onChange={(e)=>setContent(e.target.value)}
                        />
                        {
                            imagePreview && (
                                <div className='w-full h-64 flex items-center justify-center relative'>
                                    <img src={imagePreview} alt="" className='object-cover h-full w-full rounded-md'/>
                                    <button onClick={()=>setImagePreview("")} className='rounded-full p-1 cursor-pointer absolute top-3 right-3 bg-white text-gray-500'><X className='h-6 w-6'/></button>
                                </div>
                            )
                        }
                        <div className='border rounded-lg p-4 flex justify-between items-center'>
                            <h1 className='font-semibold text-gray-800'>Add to your post</h1>
                            <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler}/>
                            <div className='flex gap-3 items-center'>
                                <Image onClick={()=> imageRef.current.click()} className='text-green-600 cursor-pointer' />
                                <Video onClick={()=> imageRef.current.click()} className='text-red-500 cursor-pointer' />
                                <Smile onClick={()=> imageRef.current.click()} className='text-orange-500 cursor-pointer' />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={submitHandler} type="submit" className='w-full bg-[#0866ff] hover:bg-[#0867ffce]'>Post</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>

            </div>
            <hr className='my-4' />
            <div className='flex gap-7 items-center w-full'>
                <div onClick={() => setOpen(true)} className='flex items-center gap-2 w-full justify-center font-semibold cursor-pointer'>
                    <Image className='text-green-600' />
                    Photo
                </div>
                <div onClick={() => setOpen(true)} className='flex items-center gap-2 w-full justify-center font-semibold cursor-pointer'>
                    <Video className='text-red-500' />
                    Video
                </div>
                <div onClick={() => setOpen(true)} className='flex items-center gap-2 w-full justify-center font-semibold cursor-pointer'>
                    <Smile className='text-orange-500' />
                    Feeling
                </div>
            </div>
        </div>
    )
}

export default CreatePost
