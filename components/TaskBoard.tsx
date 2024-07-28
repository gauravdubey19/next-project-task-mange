"use client";

import { DragEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { deleteTask, getTasks, updateStatus } from "@/app/actions/task.actions";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  DeleteTaskProps,
  CardProps,
  ColumnProps,
  DropIndicatorProps,
  TasksValues,
} from "@/lib/types";
import { FaFire } from "react-icons/fa";
import { FiPlus, FiTrash } from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";
import { toast } from "./ui/use-toast";

export default function TaskBoard() {
  const [userTasks, setUserTasks] = useState<TasksValues[] | []>([]);
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (email) {
        try {
          const res = await getTasks({ email });
          if (res) setUserTasks(res);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      }
    };

    if (userTasks?.length === 0) fetchUserTasks();
  }, [email, userTasks]);
  // console.log(userTasks);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-white to-violet-700 text-neutral-50 overflow-hidden">
      <BoardContent cards={userTasks} />
    </div>
  );
}

const BoardContent: React.FC<{ cards: TasksValues[] }> = ({ cards }) => {
  const [cardsState, setCardsState] = useState<TasksValues[]>(cards);
  useEffect(() => {
    const fetchUserTasks = async () => {
      if (cards) setCardsState(cards);
    };

    if (cardsState?.length === 0) fetchUserTasks();
  }, [cards, cardsState]);

  return (
    <div className="flex h-full w-full gap-3 p-5 overflow-scroll">
      <Column
        title="To Do"
        status="To Do"
        headingColor="text-yellow-500"
        cards={cardsState}
        setCards={setCardsState}
      />
      <Column
        title="In progress"
        status="In Progress"
        headingColor="text-blue-500"
        cards={cardsState}
        setCards={setCardsState}
      />
      <Column
        title="Under Review"
        status="Under Review"
        headingColor="text-purple-500"
        cards={cardsState}
        setCards={setCardsState}
      />
      <Column
        title="Finished"
        status="Finished"
        headingColor="text-emerald-500"
        cards={cardsState}
        setCards={setCardsState}
      />
      <DeleteTask setCards={setCardsState} />
    </div>
  );
};
const DeleteTask: React.FC<DeleteTaskProps> = ({ setCards }) => {
  const [active, setActive] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((prevCards) => prevCards.filter((c) => c._id !== cardId));

    try {
      const res = await deleteTask({ cardId });
      if (res === "deleted") {
        toast({
          title: "Task Deleted successfully!",
          description: `Deleted from your tasks list...`,
        });
      }
      if (res == "doesn't-exists") {
        toast({
          variant: "destructive",
          title: "Please login first!",
          description: "Then try again later...",
        });
      }
    } catch (error) {
      console.error("Task deletion failed:", error);
    }

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`animate-slide-up mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const Column: React.FC<ColumnProps> = ({
  title,
  headingColor,
  status,
  cards,
  setCards,
}) => {
  const [active, setActive] = useState<boolean>(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, card: TasksValues) => {
    e.dataTransfer.setData("cardId", card._id);
  };

  const updateStatusInDB = async (cardId: string, newStatus: string) => {
    const res = await updateStatus(cardId, status);

    if (res == "task-updated") {
      toast({
        title: "Task Status updated successfully!",
        description: `Updated to ${newStatus}`,
      });
    }
    if (res == "doesn't-exists") {
      toast({
        variant: "destructive",
        title: "Please login first!",
        description: "Then try again later...",
      });
    }
  };

  const handleDragEnd = async (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c._id === cardId);
      if (!cardToTransfer) return;
      const oldStatus = cardToTransfer.status;
      cardToTransfer = { ...cardToTransfer, status };

      copy = copy.filter((c) => c._id !== cardId);

      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el._id === before);
        if (insertAtIndex === -1) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
      if (oldStatus !== status) await updateStatusInDB(cardId, status);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${status}"]`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.status === status);

  return (
    <div className="w-52 shrink-0">
      <div className="animate-slide-down mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          <CountUp end={filteredCards.length} />
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-100/10" : ""
        }`}
      >
        {filteredCards.map((c) => (
          <Card
            key={c._id}
            _id={c._id}
            title={c.title}
            description={c.description}
            priority={c.priority}
            deadline={c.deadline}
            datetime={c.datetime}
            status={c.status}
            handleDragStart={handleDragStart}
          />
        ))}
        <DropIndicator beforeId={null} status={status} />
        <AddCard />
      </div>
    </div>
  );
};

const Card: React.FC<CardProps> = ({
  title,
  _id,
  status,
  description,
  priority,
  deadline,
  datetime,
  handleDragStart,
}) => {
  const handleDragStartWrapper = (e: any) => {
    handleDragStart(e, {
      _id,
      title,
      status,
      description,
      priority,
      deadline,
      datetime,
    });
  };

  return (
    <>
      <div className="overflow-hidden">
        <DropIndicator beforeId={_id} status={status} />
        <motion.div
          layout
          layoutId={_id}
          draggable="true"
          onDragStart={handleDragStartWrapper}
          className="animate-slide-up cursor-grab flex flex-col gap-1 p-3 rounded-2xl text-black bg-slate-200 shadow-lg hover:scale-105 active:cursor-grabbing ease-in-out duration-500 overflow-hidden"
        >
          <div className="text-md font-bold text-balance">{title}</div>
          <div className="text-sm text-wrap">{description}</div>
          <div
            className={`w-fit text-sm text-white rounded-2xl flex-center py-1 px-3 ${priority === "Urgent" ? "bg-red-500" : priority === "Medium" ? "bg-violet-600" : "bg-green-500"}`}
          >
            {priority}
          </div>
          <div className="w-full text-sm flex items-center gap-4 p-2 md:pr-5">
            <BsClockHistory size={25} />
            {new Date(deadline).toLocaleString()}
          </div>
          <TaskTime datetime={datetime} />
        </motion.div>
      </div>
    </>
  );
};

const TaskTime = ({ datetime }: { datetime: string }) => {
  // calculating time difference between task-created and current-time
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    const seconds = Math.floor(diffInSeconds % 60);
    const minutes = Math.floor((diffInSeconds / 60) % 60);
    const hours = Math.floor((diffInSeconds / (60 * 60)) % 24);
    const days = Math.floor(diffInSeconds / (60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };
  return (
    <div className="w-fit text-xs font-semibold mt-2">{timeAgo(datetime)}</div>
  );
};
const DropIndicator: React.FC<DropIndicatorProps> = ({ beforeId, status }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={status}
      className="my-0.5 h-0.5 w-full bg-violet-600 opacity-0"
    />
  );
};
const AddCard: React.FC = () => {
  return (
    <>
      <motion.div
        layout
        className="text-xs text-neutral-600 transition-colors hover:text-neutral-950 overflow-hidden"
      >
        <Link
          href="/create-task"
          className="animate-slide-up flex w-full items-center gap-1.5 px-3 py-1.5"
        >
          <span>Add card</span>
          <FiPlus />
        </Link>
      </motion.div>
    </>
  );
};
