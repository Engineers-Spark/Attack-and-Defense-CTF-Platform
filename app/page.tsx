import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Flag, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 py-6 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-green-400">Attack And Defense CTF Platform</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome to the Competition</h2>
          <p className="text-xl text-gray-300 mb-8">
            Submit flags, attack other teams, and defend your own flags to win the competition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Team Login</CardTitle>
                <CardDescription className="text-gray-400">Access your team dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Login to submit flags and view your team's status</p>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Login</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Scoreboard</CardTitle>
                <CardDescription className="text-gray-400">View competition standings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Check the current scores of all teams</p>
              </CardContent>
              <CardFooter>
                <Link href="/scoreboard" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">View Scoreboard</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Competition Rules</h3>
            <div className="text-left space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center text-blue-400">
                  <Flag className="mr-2 h-5 w-5" /> Flag Submission
                </h4>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    • Submit your own flag: <span className="text-green-400">+10 points</span>
                  </li>
                  <li>
                    • Submit another team's flag: <span className="text-green-400">+200 points</span> for you,{" "}
                    <span className="text-red-400">-50 points</span> for them
                  </li>
                  <li>• Each team can submit a specific flag only once</li>
                  <li>• Different teams can submit the same flag</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center text-blue-400">
                  <Clock className="mr-2 h-5 w-5" /> Passive Points
                </h4>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    • Teams earn <span className="text-green-400">+1 point every 20 minutes</span> for each flag they
                    own that no other team has submitted
                  </li>
                  <li>• This rewards teams for successfully defending their flags</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center text-blue-400">
                  <Shield className="mr-2 h-5 w-5" /> Strategy
                </h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Balance between attacking other teams and defending your own flags</li>
                  <li>• The team with the highest score at the end wins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-4 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Attack And Defense CTF Platform
        </div>
      </footer>
    </div>
  )
}
