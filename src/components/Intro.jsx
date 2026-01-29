import React, { useState } from 'react'
import suitcase from "../assets/suitcase.png"
import educationLogo from "../assets/education.png"
import home from "../assets/home.png"
import map from "../assets/map.png"
import heart from "../assets/heart.png"
import call from "../assets/call.png"
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { setUserProfile } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'


const Intro = () => {
  const {  userProfile } = useSelector(store => store.auth)
  const [loadingIntro, setLoadingIntro] = useState(false)
  const [openIntroDialog, setOpenIntroDialog] = useState(false)
  const [introData, setIntroData] = useState({
    bioText: userProfile?.bio?.bioText,
    liveIn: userProfile?.bio?.liveIn,
    relationship: userProfile?.bio?.relationship,
    workplace: userProfile?.bio?.workplace,
    education: userProfile?.bio?.education,
    phone: userProfile?.bio?.phone,
    hometown: userProfile?.bio?.hometown
  })
  const dispatch = useDispatch()

  const array = [
    {
      icon: suitcase,
      text: `Web developer at ${introData.workplace}`
    },
    {
      icon: educationLogo,
      text: `Studied at ${introData.education}`
    },
    {
      icon: home,
      text: `Lives in ${introData.liveIn}`
    },
    {
      icon: map,
      text: `From ${introData.hometown}`
    },
    {
      icon: call,
      text: `${introData.phone}`
    },
    {
      icon: heart,
      text: `${introData.relationship}`
    },
  ]

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setIntroData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const selectCategory = (value) => {
    setIntroData({ ...introData, relationship: value })
  }

  const submitHandler = async () => {
    try {
      setLoadingIntro(true)
      const res = await axios.put(`http://localhost:8000/api/v1/auth/update-intro`, introData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setUserProfile({ ...userProfile, bio: res.data.bio }))
        setOpenIntroDialog(false)
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);

    } finally {
      setLoadingIntro(false)
    }
  }
  return (
    <div className='bg-white dark:bg-[#262829] flex-1 rounded-lg p-5 h-max'>
      <h1 className='text-xl font-bold mb-2 text-gray-700 dark:text-gray-200'>Intro</h1>
      <p className='mb-5'>{userProfile?.bio?.bioText || "undefined"}</p>
      {
        array.map((item, index) => {
          return <div key={index} className='flex gap-4 space-y-5'>
            <img src={item.icon} alt="" className='w-5 h-5 opacity-70 invert-50' />
            <h1>{item.text}</h1>
          </div>
        })
      }

      <Dialog open={openIntroDialog} onOpenChange={setOpenIntroDialog}>
        
          
            <Button onClick={()=>setOpenIntroDialog(true)} className='w-full dark:bg-[#3a3c3d] bg-[#e1e4e8] hover:bg-[#dfe4ea] text-gray-800 dark:text-gray-200 cursor-pointer'>Edit details</Button>
         
          <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-center">Edit details</DialogTitle>
              <hr className='my-2' />
              <DialogDescription className="text-center">
                Details that you select will be Public and appear at the top of your profile.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className='flex flex-col gap-2'>
                <Label>Bio</Label>
                <Input type="text"
                  placeholder="Tell something about yourself.."
                  name="bioText"
                  value={introData.bioText}
                  onChange={changeHandler}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label>WorkPlace</Label>
                <Input type="text"
                  placeholder="Enter your work place.."
                  name="Wrokplace"
                  value={introData.workplace}
                  onChange={changeHandler}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Education</Label>
                <Input type="text"
                  placeholder="Enter your work place.."
                  name="education"
                  value={introData.education}
                  onChange={changeHandler}
                />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='flex flex-col gap-2'>
                  <Label>Lives In</Label>
                  <Input type="text"
                    name="liveIn"
                    value={introData.liveIn}
                    onChange={changeHandler}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label>Home Town</Label>
                  <Input type="text"
                    name="hometown"
                    value={introData.hometown}
                    onChange={changeHandler}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='flex flex-col gap-2'>
                  <Label>Phone No</Label>
                  <Input type="text"
                    name="phone"
                    value={introData.phone}
                    onChange={changeHandler}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label>Status</Label>
                  <Select onValueChange={selectCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="In a relationship">In a relationship</SelectItem>
                        <SelectItem value="Engaged">Engaged</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Seperated">Seperated</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="cursor-pointer" variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={loadingIntro} onClick={submitHandler} type="submit" className='bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer'>
                {
                  loadingIntro ? <div className='flex items-center gap-2'><Loader2 className='w-4 h-4 animate-spin'/>Please wait</div> : "Save"
                }
              </Button>
            </DialogFooter>
          </DialogContent>
      
      </Dialog>
    </div>
  )
}

export default Intro
