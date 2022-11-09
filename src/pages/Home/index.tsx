import { HandPalm, Play } from 'phosphor-react'
import { createContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { differenceInSeconds } from 'date-fns'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from './styles'

interface NewCycleFormData {
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

interface CylesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CylesContextType)

export function Home() {
    const [cycle, setCycle] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const activeCycle = cycle.find((cycle) => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished() {
        setCycle((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
    }

    // function handleCreateNewCycle(data: NewCycleFormData) {
    //     const id = String(new Date().getTime())
    //     const newCycle: Cycle = {
    //         id,
    //         task: data.task,
    //         minutesAmount: data.minutesAmount,
    //         startDate: new Date(),
    //     }

    //     setCycle((state) => [...state, newCycle])
    //     setActiveCycleId(id)
    //     setAmountSecondsPassed(0)
    //     reset()
    // }

    function handleInterruptCycle() {
        setCycle((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
        setActiveCycleId(null)
    }

    // const task = watch('task')
    // const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/>
                <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}>
                    {/* <NewCycleForm /> */}
                    <Countdown />
                </CyclesContext.Provider>
                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}
