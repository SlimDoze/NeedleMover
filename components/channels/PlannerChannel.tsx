


// File: /components/channels/PlannerChannel.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Mock data for calendar events
const mockEvents = [
  { id: '1', title: 'Recording Session', date: '2023-07-10', time: '14:00', location: 'Studio A' },
  { id: '2', title: 'Mixing Session', date: '2023-07-15', time: '10:00', location: 'Home Studio' },
  { id: '3', title: 'Cover Photoshoot', date: '2023-07-20', time: '12:00', location: 'Downtown' },
  { id: '4', title: 'Release Planning', date: '2023-07-25', time: '15:00', location: 'Video Call' },
];

// Mock data for tasks
const mockTasks = [
  { id: '1', title: 'Finish recording vocals', assignee: 'Vocalist', deadline: '2023-07-12', status: 'in_progress' },
  { id: '2', title: 'Complete cover artwork', assignee: 'Designer', deadline: '2023-07-18', status: 'planned' },
  { id: '3', title: 'Submit to distribution', assignee: 'Manager', deadline: '2023-07-28', status: 'planned' },
  { id: '4', title: 'Finalize track order', assignee: 'Producer', deadline: '2023-07-05', status: 'completed' },
];

interface PlannerChannelProps {
  spaceId: string;
  channelId: string;
}

const PlannerChannel: React.FC<PlannerChannelProps> = ({ spaceId, channelId }) => {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'tasks'
  const [events, setEvents] = useState(mockEvents);
  const [tasks, setTasks] = useState(mockTasks);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // New event/task form states
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date());
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState(new Date());
  
  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      const formattedDate = newEventDate.toISOString().split('T')[0];
      
      const newEvent = {
        id: Date.now().toString(),
        title: newEventTitle,
        date: formattedDate,
        time: newEventTime || '12:00',
        location: newEventLocation || 'TBD',
      };
      
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setNewEventTime('');
      setNewEventLocation('');
      setShowAddEvent(false);
    }
  };
  
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const formattedDate = newTaskDeadline.toISOString().split('T')[0];
      
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        assignee: newTaskAssignee || 'Unassigned',
        deadline: formattedDate,
        status: 'planned',
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setShowAddTask(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const updateTaskStatus = (taskId: string, newStatus: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };
  
  const renderEventItem = ({ item }) => (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <Text className="text-lg font-medium text-gray-800 mb-1">{item.title}</Text>
      
      <View className="flex-row items-center mb-1">
        <Feather name="calendar" size={16} color="#6B7280" className="mr-2" />
        <Text className="text-gray-600">{item.date}</Text>
        <Text className="text-gray-600 mx-1">•</Text>
        <Text className="text-gray-600">{item.time}</Text>
      </View>
      
      {item.location && (
        <View className="flex-row items-center">
          <Feather name="map-pin" size={16} color="#6B7280" className="mr-2" />
          <Text className="text-gray-600">{item.location}</Text>
        </View>
      )}
      
      <View className="flex-row mt-3">
        <TouchableOpacity className="flex-row items-center mr-4">
          <Feather name="edit-2" size={16} color="#3B82F6" />
          <Text className="text-blue-500 ml-1">Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center">
          <Feather name="trash-2" size={16} color="#EF4444" />
          <Text className="text-red-500 ml-1">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderTaskItem = ({ item }) => (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-medium text-gray-800">{item.title}</Text>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
          <Text className="text-sm">
            {item.status === 'completed' ? 'Completed' : 
             item.status === 'in_progress' ? 'In Progress' : 'Planned'}
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center mb-1">
        <Feather name="user" size={16} color="#6B7280" className="mr-2" />
        <Text className="text-gray-600">{item.assignee}</Text>
      </View>
      
      <View className="flex-row items-center mb-3">
        <Feather name="calendar" size={16} color="#6B7280" className="mr-2" />
        <Text className="text-gray-600">Due: {item.deadline}</Text>
      </View>
      
      <View className="flex-row">
        {item.status !== 'completed' && (
          <TouchableOpacity 
            className="flex-row items-center mr-4"
            onPress={() => updateTaskStatus(item.id, 'completed')}
          >
            <Feather name="check-circle" size={16} color="#10B981" />
            <Text className="text-green-500 ml-1">Complete</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'planned' && (
          <TouchableOpacity 
            className="flex-row items-center mr-4"
            onPress={() => updateTaskStatus(item.id, 'in_progress')}
          >
            <Feather name="play" size={16} color="#3B82F6" />
            <Text className="text-blue-500 ml-1">Start</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity className="flex-row items-center">
          <Feather name="trash-2" size={16} color="#EF4444" />
          <Text className="text-red-500 ml-1">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-semibold text-gray-800">Planner</Text>
        <TouchableOpacity 
          className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center"
          onPress={() => activeTab === 'calendar' ? setShowAddEvent(true) : setShowAddTask(true)}
        >
          <Feather name="plus" size={16} color="white" />
          <Text className="text-white ml-1">
            {activeTab === 'calendar' ? 'Add Event' : 'Add Task'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row bg-gray-200 rounded-lg mb-6 p-1">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md ${activeTab === 'calendar' ? 'bg-white' : ''}`}
          onPress={() => setActiveTab('calendar')}
        >
          <Text className={`text-center font-medium ${activeTab === 'calendar' ? 'text-blue-600' : 'text-gray-600'}`}>
            Calendar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md ${activeTab === 'tasks' ? 'bg-white' : ''}`}
          onPress={() => setActiveTab('tasks')}
        >
          <Text className={`text-center font-medium ${activeTab === 'tasks' ? 'text-blue-600' : 'text-gray-600'}`}>
            Tasks
          </Text>
        </TouchableOpacity>
      </View>
      
      {showAddEvent && (
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Add New Event</Text>
          
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">Event Title</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
              placeholder="Enter event title"
            />
          </View>
          
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">Date</Text>
            <DateTimePicker
              value={newEventDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setNewEventDate(selectedDate || newEventDate);
              }}
            />
          </View>
          
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">Time</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={newEventTime}
              onChangeText={setNewEventTime}
              placeholder="e.g. 14:00"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Location</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={newEventLocation}
              onChangeText={setNewEventLocation}
              placeholder="Enter location"
            />
          </View>
          
          <View className="flex-row">
            <TouchableOpacity
              className="bg-gray-200 rounded-lg px-4 py-2 mr-2 flex-1"
              onPress={() => setShowAddEvent(false)}
            >
              <Text className="text-gray-800 text-center">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-4 py-2 flex-1"
              onPress={handleAddEvent}
            >
              <Text className="text-white text-center">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {showAddTask && (
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Add New Task</Text>
          
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">Task Title</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Enter task title"
            />
          </View>
          
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">Assignee</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={newTaskAssignee}
              onChangeText={setNewTaskAssignee}
              placeholder="Enter assignee name"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Deadline</Text>
            <DateTimePicker
              value={newTaskDeadline}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setNewTaskDeadline(selectedDate || newTaskDeadline);
              }}
            />
          </View>
          
          <View className="flex-row">
            <TouchableOpacity
              className="bg-gray-200 rounded-lg px-4 py-2 mr-2 flex-1"
              onPress={() => setShowAddTask(false)}
            >
              <Text className="text-gray-800 text-center">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-4 py-2 flex-1"
              onPress={handleAddTask}
            >
              <Text className="text-white text-center">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <FlatList
        data={activeTab === 'calendar' ? events : tasks}
        renderItem={activeTab === 'calendar' ? renderEventItem : renderTaskItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default PlannerChannel;