import { HandPalm, Play } from 'phosphor-react'
import { useContext } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CyclesContext'
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from './styles'

interface NewCycleFormData {
    task: string
    minutesAmount: number
}

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)
    const newCycleForm = useForm<NewCycleFormData>({
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const { handleSubmit, watch /*reset*/ } = newCycleForm
    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}
