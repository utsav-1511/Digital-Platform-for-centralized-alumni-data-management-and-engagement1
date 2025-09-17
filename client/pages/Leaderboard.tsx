import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface LeaderboardItem {
  alumniId: string;
  name: string;
  points: number;
  dailyActivity: number;
  eventsAttended: number;
  mentorships: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const res = await fetch("/api/leaderboard");

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const data: LeaderboardItem[] = await res.json();
        setLeaderboardData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (isLoading) return <div>Loading leaderboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Alumni Leaderboard
        </CardTitle>
        <CardDescription>
          Ranking of alumni based on their engagement and contributions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Daily Activity</TableHead>
              <TableHead className="text-right">Events Attended</TableHead>
              <TableHead className="text-right">Mentorships</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((item, index) => (
              <TableRow key={item.alumniId}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right font-bold text-primary">
                  {item.points}
                </TableCell>
                <TableCell className="text-right">{item.dailyActivity}</TableCell>
                <TableCell className="text-right">{item.eventsAttended}</TableCell>
                <TableCell className="text-right">{item.mentorships}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}