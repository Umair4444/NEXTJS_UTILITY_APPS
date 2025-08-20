export type Note = {
id: string
title: string
content: string
tags: string[]
createdAt: string
updatedAt: string
}


const KEY = 'notes.v1'


export function loadNotes(): Note[] {
if (typeof window === 'undefined') return []
try {
const raw = localStorage.getItem(KEY)
return raw ? (JSON.parse(raw) as Note[]) : []
} catch {
return []
}
}


export function saveNotes(notes: Note[]) {
if (typeof window === 'undefined') return
localStorage.setItem(KEY, JSON.stringify(notes))
}