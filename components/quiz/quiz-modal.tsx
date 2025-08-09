'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Trophy } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
  timeLimit?: number
}

interface QuizModalProps {
  lessonId: string
  quiz?: Quiz
}

export function QuizModal({ lessonId, quiz }: QuizModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const questions = quiz?.questions || []

  useEffect(() => {
    if (quiz?.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60) // Convert to seconds
    }
  }, [quiz])

  // Clamp current question index when question list changes
  useEffect(() => {
    if (questions.length === 0) {
      setCurrentQuestion(0)
    } else if (currentQuestion > questions.length - 1) {
      setCurrentQuestion(questions.length - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length])

  useEffect(() => {
    if (timeLeft > 0 && isOpen && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft, isOpen, isSubmitted])

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleSubmit = () => {
    if (!quiz || questions.length === 0) return

    let correctAnswers = 0
    questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)
    setIsSubmitted(true)
  }

  const handleNext = () => {
    if (currentQuestion < (questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Сайн байна!'
    if (score >= 60) return 'Дунджаар байна'
    return 'Дахин оролдоно уу'
  }

  if (!quiz || questions.length === 0) return null

  const safeIndex = Math.min(currentQuestion, questions.length - 1)
  const currentQ = questions[safeIndex]

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
        size="lg"
      >
        <Trophy className="mr-2 h-4 w-4" />
        Шалгалт өгөх
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{quiz.title}</span>
              {quiz.timeLimit && (
                <Badge variant={timeLeft < 60 ? 'destructive' : 'secondary'}>
                  {formatTime(timeLeft)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Асуулт {safeIndex + 1} / {questions.length}
                </span>
                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === safeIndex
                          ? 'bg-blue-500'
                          : answers[questions[index].id] !== undefined
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {currentQ.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[currentQ.id] !== undefined ? String(answers[currentQ.id]) : ''}
                    onValueChange={(value) => 
                      handleAnswerSelect(currentQ.id, parseInt(value))
                    }
                  >
                    {currentQ.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`${currentQ.id}-${index}`} />
                        <Label htmlFor={`${currentQ.id}-${index}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                >
                  Өмнөх
                </Button>

                {safeIndex === questions.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
                    Дуусгах
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Дараах
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              
              <div className="text-xl font-semibold">
                {getScoreMessage(score)}
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <Card key={question.id} className={`border-2 ${
                      isCorrect ? 'border-green-200' : 'border-red-200'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-2">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">{question.question}</p>
                            <p className="text-sm text-gray-600">
                              Зөв хариулт: {question.options[question.correctAnswer]}
                            </p>
                            {!isCorrect && userAnswer !== undefined && (
                              <p className="text-sm text-red-600">
                                Таны хариулт: {question.options[userAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Button onClick={() => setIsOpen(false)}>
                Хаах
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
