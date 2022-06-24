import React, { ChangeEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { createNoteAsync, removeNoteAsync, selectNotes } from '../../slices/notesSlice'
import { SmallButton } from '../SmallButton'
import { Button } from '../Button'
import { selectGameId } from '../../slices/gameSlice'
import { selectIsLoading } from '../../slices/statusSlice'
import ReactMarkdown from 'react-markdown'
import { NoteFrame } from './NoteFrame'
import './Notes.css'
import { selectIsStrifePlayer } from '../../slices/playerSlice'
import { Placeholder } from '../Placeholder'

const addNoteHandler =
    (
        dispatch: AppDispatch,
        setEdit: React.Dispatch<React.SetStateAction<boolean>>,
        setText: React.Dispatch<React.SetStateAction<string>>,
        gameId: string,
        text: string
    ) =>
    () => {
        dispatch(createNoteAsync({ gameId, text }))
        setEdit(false)
        setText('')
    }

const deleteNoteHandler = (dispatch: AppDispatch, gameId: string, noteId: string) => () => {
    dispatch(removeNoteAsync({ gameId, noteId }))
}

export const Notes = () => {
    const dispatch = useAppDispatch()
    const isStrifePlayer = useSelector(selectIsStrifePlayer)
    const loading = useSelector(selectIsLoading)
    const gameId = useSelector(selectGameId)
    const [edit, setEdit] = useState(false)
    const [text, setText] = useState('')
    const notes = useSelector(selectNotes)

    if (gameId === undefined) {
        return <></>
    }

    return (
        <section>
            <h2>
                <div className="flex place-content-between">
                    <span>Notes</span>
                    {!edit && isStrifePlayer && (
                        <Button className="py-2" disabled={loading} onClick={() => setEdit(true)}>
                            Add Note
                        </Button>
                    )}
                </div>
            </h2>
            {edit && (
                <NoteFrame>
                    <textarea
                        aria-label='Enter note here'
                        rows={5}
                        value={text}
                        className="w-full display-inline border-2 leading-7 mr-2 px-1"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                        placeholder="Enter note here, in #markdown if you like..."
                    ></textarea>
                    <SmallButton onClick={addNoteHandler(dispatch, setEdit, setText, gameId, text)} className="mr-2">
                        Save
                    </SmallButton>
                    <SmallButton onClick={() => setEdit(false)}>Cancel</SmallButton>
                </NoteFrame>
            )}
            {!edit && notes.length === 0 ? (
                <Placeholder>There are currently no notes</Placeholder>
            ) : (
                <div>
                    {notes.map((note) => (
                        <NoteFrame className="flex justify-between">
                            <div>
                                <ReactMarkdown className="markdown break-words" key={note.id}>
                                    {note.text}
                                </ReactMarkdown>
                            </div>
                            {isStrifePlayer && (
                                <SmallButton
                                    onClick={deleteNoteHandler(dispatch, gameId, note.id)}
                                    className="h-9"
                                    title="Delete note"
                                >
                                    X
                                </SmallButton>
                            )}
                        </NoteFrame>
                    ))}
                </div>
            )}
        </section>
    )
}
