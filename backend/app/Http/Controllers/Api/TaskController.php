<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
class TaskController extends Controller
{
    public function store(Request $request, Project $project)
    {
        abort_if($project->user_id !== $request->user()->id, 403);
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|in:low,medium,high',
        ]);
        $task = $project->tasks()->create($data);
        return response()->json($task, 201);
    }

    public function update(Request $request, Project $project, Task $task)
    {
        abort_if($project->user_id !== $request->user()->id, 403);
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:todo,in-progress,done',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|in:low,medium,high',
        ]);
        $task->update($data);
        return response()->json($task);
    }

    public function destroy(Request $request, Project $project, Task $task)
    {
        abort_if($project->user_id !== $request->user()->id, 403);
        $task->delete();
        return response()->json(null, 204);
    }
}
