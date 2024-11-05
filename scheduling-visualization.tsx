import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

const SchedulerVisualization = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTick, setCurrentTick] = useState(0);
  const [metrics, setMetrics] = useState([]);
  
  // Simulate scheduling decisions over time
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTick(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return prev;
          }
          // Simulate metrics
          const utilization = 65 + Math.random() * 20;
          const throughput = 35000 + Math.random() * 10000;
          const waiting = Math.max(0, 100 - (currentTick * 2) + Math.random() * 30);
          
          setMetrics(prev => [...prev, {
            tick: prev.length,
            utilization,
            throughput: throughput / 1000, // Scale for visualization
            waitingJobs: waiting
          }]);
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTick]);

  const resetSimulation = () => {
    setCurrentTick(0);
    setMetrics([]);
    setIsPlaying(false);
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Real-time GNN-RL Scheduler Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex justify-center space-x-4">
              <button
                className="p-2 rounded-full bg-blue-500 text-white"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                className="p-2 rounded-full bg-gray-500 text-white"
                onClick={resetSimulation}
              >
                <RotateCcw size={24} />
              </button>
            </div>
            
            <div className="h-64">
              <LineChart
                width={600}
                height={250}
                data={metrics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tick" label={{ value: 'Time (s)', position: 'bottom' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="#8884d8" 
                  name="Resource Utilization (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#82ca9d" 
                  name="Throughput (k jobs/s)"
                />
                <Line 
                  type="monotone" 
                  dataKey="waitingJobs" 
                  stroke="#ff7300" 
                  name="Waiting Jobs"
                />
              </LineChart>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulerVisualization;
