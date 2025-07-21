"use client"

import { ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TrustScoreCardProps {
  score: number
}

export function TrustScoreCard({ score }: TrustScoreCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardDescription className="flex items-center gap-1.5 text-sm">
          <ShieldCheck className="h-4 w-4 text-primary" />
          TrustScore Evaluation
        </CardDescription>
        <CardTitle className="text-4xl font-bold flex items-baseline gap-2">
          {score}
          <span className="text-lg font-normal text-muted-foreground">/ 100</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Progress value={score} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your TrustScore is based on your activity, reviews, and transaction history.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          System Secured by <span className="font-semibold text-primary">Trustscore</span>
        </p>
      </CardContent>
    </Card>
  )
}
