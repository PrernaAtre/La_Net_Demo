"use client";
import MainLayout from "@/app/(dashboard)/layout";
import { fetchNoteById } from "@/redux_store/slices/notesSlice";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar } from "@/app/(dashboard)/_components/navbar";

export default function Page({ params }: { params: { documentId: string } }) {
  const singleDocument = useSelector((state) => state.notes.note);
  const dispatch = useDispatch();
  const documentId = params.documentId;
  useEffect(() => {
    // Fetch the note details when the component mounts

    dispatch(fetchNoteById(documentId));
    console.log("singleDocument : ", singleDocument);
  }, [dispatch, documentId]);

  console.log("single -----,", singleDocument);
  return (
    <>
      <MainLayout>
        <Navbar documentId={documentId} />
        {/* <div className="relative">
                    <div role="button" onClick={handleShare} className="absolute top-0 right-0 mt-4 mr-4 flex items-center justify-center select-none transition duration-200 ease-in inline-flex whitespace-nowrap h-7 rounded-md text-sm leading-6 min-w-0 px-2 text-gray-700 cursor-pointer">
                        <IosShareIcon />
                    </div>
                </div>
                <div>
                    <button onClick={handleShare}><IosShareIcon /></button>


                    <h2>{singleDocument.title}</h2>
                    <p>{singleDocument.description}</p>
                    <img src={singleDocument.coverImageUrl} alt="Cover Image" />
                    <img src={singleDocument.iconImage} alt="Cover Image" />
                    Render other details of the note
                </div> */}
        <div className="relative">
          {/* Share button in the header */}

          {/* Title and Icon */}
          <div className="flex items-center justify-center mt-8">
            <h2 className="mr-2">{singleDocument.title}</h2>
            <img
              src={singleDocument.iconImage}
              alt="Icon"
              className="h-8 w-8"
            />
          </div>
          {/* Cover Image */}
          <img
            src={singleDocument.coverImageUrl}
            alt="Cover Image"
            className="w-full"
          />
        </div>
        {/* Description */}
        <div className="px-4 mt-4">
          <p>{singleDocument.description}</p>
        </div>
      </MainLayout>
    </>
  );
}
