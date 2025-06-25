"use client"

import * as React from "react"
import CalendarLib from "react-calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof CalendarLib>

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-md bg-background text-foreground shadow-md",
        className
      )}
    >
      <CalendarLib
        prevLabel={<ChevronLeft className="h-4 w-4 opacity-50 hover:opacity-100" />}
        nextLabel={<ChevronRight className="h-4 w-4 opacity-50 hover:opacity-100" />}
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: "short" }).slice(0, 2)
        }
        navigationLabel={({ label }) => (
          <span className="text-sm font-medium">{label}</span>
        )}
        tileClassName={({ date, view }) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 text-sm p-0 font-normal rounded-md",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )
        }
        className="w-full border-collapse [&_abbr]:no-underline text-sm"
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
