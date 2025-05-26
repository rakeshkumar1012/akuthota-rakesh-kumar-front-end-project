"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SkillInputProps {
  skills: string[]
  onChange: (skills: string[]) => void
  placeholder?: string
}

export function SkillInput({ skills, onChange, placeholder = "Add a skill..." }: SkillInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!skills.includes(inputValue.trim())) {
        const newSkills = [...skills, inputValue.trim()]
        onChange(newSkills)
      }
      setInputValue("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove)
    onChange(newSkills)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="rounded-2xl flex items-center gap-1">
            {skill}
            <button type="button" onClick={() => removeSkill(skill)} className="ml-1 rounded-full hover:bg-muted p-0.5">
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {skill}</span>
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="rounded-2xl"
      />
      <p className="text-xs text-muted-foreground">Press Enter to add a skill</p>
    </div>
  )
}
