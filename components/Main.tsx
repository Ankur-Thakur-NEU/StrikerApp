import React, { useContext, useEffect, useState } from 'react'
import { NextPage } from "next"
import Select from 'react-select';
import socketService from '../services/socketService';
import gameContext, { IGameContextProps } from '../interface/gameContext';
import gameService from '../services/gameService';
import Game from './Game';

const Main: NextPage = () => {
    const connectSocket = async () => {
        const socket = await socketService
            .connect("http://localhost:9000")
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    useEffect(() => {
        connectSocket();
    }, []);
    const Numbers = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" },
        { value: 10, label: "10" },
    ];
    const [selectedOptions, setSelectedOptions] = useState(null);
    const [showMe, setShowMe] = useState(false);

    const setHandle = (e) => {
        setSelectedOptions(Array.isArray(e) ? e.map((hotel) => hotel.label) : []);
    };

    const [roomName, setRoomName] = useState("");
    const [isJoining, setJoining] = useState(false);
    const { setInRoom, isInRoom } = useContext(gameContext);

    // const [isInRoom, setInRoom] = useState(false);
    const [playerSymbol, setPlayerSymbol] = useState<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9">("1");
    // const [isPlayerTurn, setPlayerTurn] = useState(false);
    // const [isGameStarted, setGameStarted] = useState(false);

    // const connectSocket = async () => {
    //     const socket = await socketService
    //         .connect("http://localhost:9000")
    //         .catch((err) => {
    //             console.log("Error: ", err);
    //         });
    // };

    // useEffect(() => {
    //     connectSocket();
    // }, []);

    // const gameContextValue: IGameContextProps = {
    //     isInRoom,
    //     setInRoom,
    //     playerSymbol,
    //     setPlayerSymbol,
    //     isPlayerTurn,
    //     setPlayerTurn,
    //     isGameStarted,
    //     setGameStarted,
    // };

    const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
        const value = e.target.value;
        setRoomName(value);
    };

    const joinRoom = async (e: React.FormEvent) => {
        setShowMe(!showMe);
        e.preventDefault();

        const socket = socketService.socket;
        if (!roomName || roomName.trim() === "" || !socket) return;

        setJoining(true);

        const joined = await gameService
            .joinGameRoom(socket, roomName)
            .catch((err) => {
                alert(err);
            });

        if (joined) setInRoom(true);

        setJoining(false);
    };

    return (
        <div>
            <div className='w-full h-screen text-center' style={{
                display: !showMe ? "block" : "none"
            }}>
                <div className='max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center'>
                    <div>
                        <div className="w-full max-w-sm p-4 bg-white border rounded-lg shadow-md sm:p-6 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                                Player
                            </h5>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Select 5 numbers</p>
                            <ul className="my-4 space-y-3">
                                <li>
                                    {/* {numbers.map((number) => (
                                        <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                            <span className="flex-1 ml-3 whitespace-nowrap">{number}</span>
                                        </a>
                                    ))} */}
                                    <Select id="selectWarna"
                                        instanceId="selectWarna"
                                        isMulti
                                        name="colors"
                                        className="basic-multi-select"
                                        classNamePrefix="select" options={Numbers} onChange={setHandle} isOptionDisabled={() => selectedOptions?.length >= 5} />
                                </li>
                                {/* <div>{selectedOptions}</div> */}
                            </ul>
                        </div>

                    </div>
                </div>
                <div className="flex justify-center">
                    <form onSubmit={joinRoom}>
                        <div className="mb-3 xl:w-96">
                            <input
                                type="text"
                                className="
                            form-control
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                placeholder="Enter Game Room Name"
                                value={roomName}
                                onChange={handleRoomNameChange}
                            />
                        </div>

                        <button type="submit" disabled={(!selectedOptions || selectedOptions?.length < 5 || !roomName)}
                            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        > Start Game</button>
                    </form>
                </div>
            </div>

            <div className="'w-full h-screen text-center'" style={{
                display: showMe ? "block" : "none"
            }}>
                <Game />
            </div>
        </div>
    )
}

export default Main