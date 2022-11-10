import { createContext, ReactNode, useReducer, useState } from "react"

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

interface CyclesContextType {
    cycle: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [cycle, displatch] = useReducer((state: Cycle[], action: any) => {
        if (action.type === 'ADD_NEW_CYCLE') {
            return [...state, action.payload.newCycle]
        }

        return state
    }, [])

    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
    const activeCycle = cycle.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        displatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId,
            }
        })

        // setCycle((state) =>
        //     state.map((cycle) => {
        //         if (cycle.id === activeCycleId) {
        //             return { ...cycle, finishedDate: new Date() }
        //         } else {
        //             return cycle
        //         }
        //     }),
        // )
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        displatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            }
        })

        // setCycle((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
        displatch({
            type: 'INTERRUPT_NEW_CYCLE',
            payload: {
                activeCycleId,
            }
        })

        // setCycle((state) =>
        //     state.map((cycle) => {
        //         if (cycle.id === activeCycleId) {
        //             return { ...cycle, interruptedDate: new Date() }
        //         } else {
        //             return cycle
        //         }
        //     }),
        // )
        setActiveCycleId(null)
    }

    return (
        <CyclesContext.Provider
            value={{
                cycle,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}