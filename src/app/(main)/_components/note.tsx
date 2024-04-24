// components/MyForm.js
"use client"
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import { SetStateAction, useEffect, useState } from 'react';
import EmojiPicker from "emoji-picker-react"
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { fetchNotes } from '@/redux_store/slices/notesSlice';
import { Button } from '@/components/ui/button';

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from './sidebar';
import MainLayout from '../layout';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";


interface NoteFormDataType {
  title: string;
  coverImageUrl: File | null;
  iconImage: string;
  description: string;
}

const NoteForm: React.FC = () => {
  const [blockNoteContent, setBlockNoteContent] = useState('');
  const editor = useCreateBlockNote();
  const router = useRouter()
  const user = useSelector((state) => state.auth.user.user);
  const initialValues: NoteFormDataType = {
    title: '',
    coverImageUrl: null,
    iconImage: '',
    description: '',
  };

  const noteFormSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    coverImageUrl: Yup.mixed().test('fileFormat', 'Image only', (value) => {
      if (!value) return true
      const file = value as File
      return ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    }),
    iconImage: Yup.string(),
    description: Yup.string(),
  });

  // const [coverImage, setCoverImage] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(undefined);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    // Handle form submission
    console.log(values);
    setSubmitting(false);
  };
  console.log("blockNoteContent : ", blockNoteContent);
  // const onSubmit = (values: FormValues) => {
  //   console.log(values);
  //   // dispatch(createNote(values));
  //   // Optionally, you can reset the form here
  // };
  // useEffect(()=>{
  //   dispatch(fetchNotes());
  // },[dispatch])

  const formik = useFormik({
    initialValues,
    validationSchema: noteFormSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("coverImageUrl", values.coverImageUrl as File);
      formData.append("iconImage", selectedEmoji as string);
      formData.append("description", values.description);
      formData.append("userId", user._id);
      try {
        // console.log("create  note try :", [...formdata.entries()]);
        const response = await axios.post('http://localhost:3001/document/createDocument', formData);
        console.log("res : ", response);
        if (response.status == 201) {
          console.log("response.status  : ", response.status);
          await toast.success('Document Created Successfully');
          dispatch(fetchNotes(user._id));
          router.push('/')
        }
      }
      catch (error) {
        console.log("error : ", error)
      }
      // console.log([...formData.entries()]);
      // dispatch(fetchNotes(user._id));
    }
  });

  console.log(formik.errors);

  const handleBlockNoteChange = (content: string) => {
    setBlockNoteContent(content);
  };

  return (
    <>
      <MainLayout>
        <div>
          <h1>{formik.values.title}</h1>
          <img src=''></img>
        </div>

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Title"
            />
            {/* <ErrorMessage name="title" component="div" className="error" /> */}
          </div>

          <div>
            <input
              type="text"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Description"
            />
            {/* <ErrorMessage name="title" component="div" className="error" /> */}
          </div>

          <div>
            <label htmlFor="coverImage">Cover Image</label>
            <input
              type="file"
              id="coverImageUrl"
              name="coverImageUrl"
              onChange={(event) => {
                console.log("testtt---", event.target.files?.[0])
                const files = event.currentTarget.files;
                if (files && files.length > 0) {
                  console.log("data---", files)
                  const fileName = files?.[0];
                  console.log(fileName)
                  formik.setFieldValue('coverImageUrl', event.currentTarget.files?.[0]);
                } else {
                  // Handle case where no files are selected
                }
              }}
            />
            {/* {coverImage && <img src={coverImage} alt="Cover" style={{ maxWidth: '200px' }} />} */}
          </div>

          <div>
            <label htmlFor="emoji">Emoji</label>
            <button type="button" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>Select Emoji</button>
            {emojiPickerVisible && (
              <EmojiPicker
                onEmojiClick={(data) => {
                  // Extract emoji from data
                  const emoji = data.imageUrl;
                  console.log("emoji : ", emoji)
                  // Update state
                  setSelectedEmoji(emoji);
                  console.log("selected emoji : ", data.emoji);
                  setEmojiPickerVisible(false);
                }}
              />
            )}
            {selectedEmoji && (
              <div>
                Selected Emoji: <span>{selectedEmoji}</span>
              </div>
            )}
          </div>

          <Button type="submit" >
            Submit
          </Button>
          <ToastContainer />
        </form>

        {/* <BlockNoteView editor={editor} onChange={handleBlockNoteChange}/>; */}
      </MainLayout>

    </>
  )
}

export default NoteForm;


