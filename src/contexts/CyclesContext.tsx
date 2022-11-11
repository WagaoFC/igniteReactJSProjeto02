import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react"
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[]
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
    const [cycleState, displatch] = useReducer(cyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        }, () => {
            const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON)
            }
        }
    )

    const { cycles, activeCycleId } = cycleState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }

        return 0
    })

    useEffect(() => {
        const stateJSON = JSON.stringify(cycleState)

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    })

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        displatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        displatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
        displatch(interruptCurrentCycleAction())
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
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