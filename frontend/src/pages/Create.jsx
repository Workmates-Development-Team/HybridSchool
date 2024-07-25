import { useEffect, useState } from "react";
import HandleAudio from "@/components/HandleAudio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import HandleVideo from "@/components/HandleVideo";
import HandleText from "@/components/HandleText";
import HandleImage from "@/components/HandleImage";
import HandlePdf from "@/components/HandlePdf";
import { useParams } from "react-router-dom";
import { MAIN_API } from "@/constants/path";
import axios from "axios";

export default function Create() {
  const [activeTab, setActiveTab] = useState("voice");
  const {id} = useParams();
  const [roomName, setRoomName] = useState("");
  
  useEffect(()=>{

    if(id)
    {  
    const apiUrl = `${MAIN_API}api/v1/notes/${id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("Fetched notes successfully!", response?.data?.title);
        setRoomName(response?.data?.title);
         // Assuming response.data is an array of notes
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        // Handle error scenarios, show error message, etc.
      });
    }
  },[id]);


  return (
    <>
<div className="w-full h-full flex flex-col">
      <div
        style={{
          backgroundColor: 'gray',
          padding: '10px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
        }}
      >
      Room Title :  {roomName}
      </div>
      <Tabs
        defaultValue="voice"
        className="w-full flex flex-col flex-grow"
        style={{
          height: 'calc(100vh - 60px)',
        }}
      >
        <TabsList className="mt-4 mb-4 max-w-7xl mx-auto flex flex-wrap gap-2">
          <TabsTrigger
            value="voice"
            onClick={() => setActiveTab('voice')}
            className={cn(
              buttonVariants({
                variant: activeTab !== 'voice' ? 'outline' : '',
              })
            )}
          >
            Voice
          </TabsTrigger>
          <TabsTrigger
            value="video"
            onClick={() => setActiveTab('video')}
            className={cn(
              buttonVariants({
                variant: activeTab !== 'video' ? 'outline' : '',
              })
            )}
          >
            Video
          </TabsTrigger>
          <TabsTrigger
            value="text"
            onClick={() => setActiveTab('text')}
            className={cn(
              buttonVariants({
                variant: activeTab !== 'text' ? 'outline' : '',
              })
            )}
          >
            Text
          </TabsTrigger>
          <TabsTrigger
            value="image"
            onClick={() => setActiveTab('image')}
            className={cn(
              buttonVariants({
                variant: activeTab !== 'image' ? 'outline' : '',
              })
            )}
          >
            Upload Image
          </TabsTrigger>
          <TabsTrigger
            value="pdf"
            onClick={() => setActiveTab('pdf')}
            className={cn(
              buttonVariants({
                variant: activeTab !== 'pdf' ? 'outline' : '',
              })
            )}
          >
            Upload Pdf
          </TabsTrigger>
        </TabsList>
        <TabsContent value="voice" className="flex-grow">
          <HandleAudio />
        </TabsContent>
        <TabsContent value="video" className="flex-grow">
          <HandleVideo />
        </TabsContent>
        <TabsContent value="text" className="flex-grow">
          <HandleText />
        </TabsContent>
        <TabsContent value="image" className="flex-grow">
          <HandleImage />
        </TabsContent>
        <TabsContent value="pdf" className="flex-grow">
          <HandlePdf />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}
