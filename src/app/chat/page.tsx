"use client";

import CareServiceRecommender from '@/ui/drawer/careservice';
import { useRouter } from 'next/navigation';
import { Drawer } from 'vaul';

type Workflow = {
  prompt: string;
  ui: React.ComponentType;
};

const workflows: Workflow[] = [{
    prompt: "🏥 What caregiving options do I have?",
    ui: CareServiceRecommender,
  },
];


export default function ChatIntro() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full w-full place-items-center place-content-between">
      <div className="flex flex-col place-items-center h-full place-content-center text-center gap-2">
        <span className="text-xl md:text-3xl font-bold">Welcome, Linda</span>
        <span>CareCompass+ is a care recommender that provides you recommendations based on your caregiving needs.</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <span className="font-semibold text-sm">How can I help you today?</span>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {workflows.map((workflow, index) => <WorkflowTrigger key={index} workflow={workflow} />)}
          <button
            className="bg-white px-4 py-2 min-h-12 border border-[rgb(191,194,200)] rounded-md hover:bg-gray-50 ease-in duration-100 leading-tight text-sm"
            onClick={() => {
              router.push('/dashboard');
            }}
          >
            💵 What support might I be eligible for?
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkflowTrigger({ workflow }: { workflow: Workflow }) {
  return (
    <Drawer.Root shouldScaleBackground>
    <Drawer.Trigger asChild>
      <button className="bg-white px-4 py-2 min-h-12 border border-[rgb(191,194,200)] rounded-md hover:bg-gray-50 ease-in duration-100 leading-tight text-sm">{workflow.prompt}</button>
    </Drawer.Trigger>
    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
    <Drawer.Portal>
      <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[100dvh] mx-[-1px]">
        <Drawer.Handle className='my-4'/>
        <workflow.ui />
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
  );
}
