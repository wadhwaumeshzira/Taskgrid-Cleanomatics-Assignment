/**
 * Integration Test Suite for Task Management REST API
 * Run with: node test-api.js
 */
const http = require('http');
const app = require('./src/app');

const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('\n🚀 Starting TaskFlow API Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const server = app.listen(PORT, async () => {
    try {
      // 1. Health check
      const healthRes = await fetch(`${BASE_URL}/`);
      const health = await healthRes.json();
      assert(healthRes.status === 200, 'GET / returns 200');
      assert(health.status === 'OK', 'GET / returns status OK');

      // 2. GET all tasks
      const listRes = await fetch(`${BASE_URL}/api/tasks`);
      const list = await listRes.json();
      assert(listRes.status === 200, 'GET /api/tasks returns 200');
      assert(Array.isArray(list.data.tasks), 'GET /api/tasks returns tasks array');
      assert(list.data.pagination && list.data.pagination.total >= 0, 'GET /api/tasks includes pagination metadata');

      // 3. GET stats
      const statsRes = await fetch(`${BASE_URL}/api/tasks/stats`);
      const stats = await statsRes.json();
      assert(statsRes.status === 200, 'GET /api/tasks/stats returns 200');
      assert(typeof stats.data.total === 'number', 'Stats includes numeric total');
      assert(typeof stats.data.pending === 'number', 'Stats includes pending count');
      assert(typeof stats.data.in_progress === 'number', 'Stats includes in_progress count');
      assert(typeof stats.data.completed === 'number', 'Stats includes completed count');

      // 4. POST create task (valid)
      const newTaskData = {
        title: 'Interview Preparation Task',
        description: 'Review architecture diagrams and prepare talking points for technical discussion.',
        status: 'pending',
        priority: 'high',
        dueDate: '2026-10-10',
      };
      const createRes = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });
      const created = await createRes.json();
      assert(createRes.status === 201, 'POST /api/tasks returns 201 Created');
      assert(created.success === true, 'POST /api/tasks returns success: true');
      assert(created.data && created.data.title === newTaskData.title, 'Created task has matching title');
      assert(created.data.id && typeof created.data.id === 'string', 'Created task has unique UUID');
      const createdId = created.data.id;

      // 5. POST create task (validation failure: missing title)
      const invalidRes1 = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'Missing title task' }),
      });
      const invalidJson1 = await invalidRes1.json();
      assert(invalidRes1.status === 400, 'POST /api/tasks without title returns 400 Bad Request');
      assert(invalidJson1.errors && invalidJson1.errors.length > 0, 'Validation errors array returned on missing title');

      // 6. POST create task (validation failure: invalid status)
      const invalidRes2 = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Invalid Status Task',
          description: 'Testing validation error handling',
          status: 'invalid_status_value',
        }),
      });
      assert(invalidRes2.status === 400, 'POST /api/tasks with invalid status returns 400 Bad Request');

      // 7. GET task by ID
      const getRes = await fetch(`${BASE_URL}/api/tasks/${createdId}`);
      const fetched = await getRes.json();
      assert(getRes.status === 200, 'GET /api/tasks/:id returns 200');
      assert(fetched.data.id === createdId, 'Fetched task matches requested ID');

      // 8. PUT update task
      const updateData = {
        title: 'Interview Preparation Task (Updated)',
        description: 'Successfully reviewed architecture and ready for live demo.',
        status: 'in_progress',
        priority: 'high',
      };
      const updateRes = await fetch(`${BASE_URL}/api/tasks/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const updated = await updateRes.json();
      assert(updateRes.status === 200, 'PUT /api/tasks/:id returns 200');
      assert(updated.data.title === updateData.title, 'Updated task title reflects modification');
      assert(updated.data.status === 'in_progress', 'Updated task status reflects modification');

      // 9. DELETE task
      const delRes = await fetch(`${BASE_URL}/api/tasks/${createdId}`, {
        method: 'DELETE',
      });
      const deleted = await delRes.json();
      assert(delRes.status === 200, 'DELETE /api/tasks/:id returns 200');
      assert(deleted.success === true, 'DELETE /api/tasks/:id returns success: true');

      // 10. Verify 404 for deleted task
      const verifyDelRes = await fetch(`${BASE_URL}/api/tasks/${createdId}`);
      assert(verifyDelRes.status === 404, 'GET /api/tasks/:id on deleted task returns 404 Not Found');

      // 11. Search query test
      const searchRes = await fetch(`${BASE_URL}/api/tasks?search=assignment`);
      const searchData = await searchRes.json();
      assert(searchRes.status === 200, 'GET /api/tasks?search=assignment returns 200');
      assert(searchData.data.tasks.every(t =>
        t.title.toLowerCase().includes('assignment') || t.description.toLowerCase().includes('assignment')
      ), 'Search results match query string');

      // 12. Filter by status test
      const filterRes = await fetch(`${BASE_URL}/api/tasks?status=completed`);
      const filterData = await filterRes.json();
      assert(filterRes.status === 200, 'GET /api/tasks?status=completed returns 200');
      assert(filterData.data.tasks.every(t => t.status === 'completed'), 'All returned tasks have completed status');

      // Summary
      console.log(`\n========================================`);
      console.log(`  Tests Passed: ${passed}`);
      console.log(`  Tests Failed: ${failed}`);
      console.log(`  Result:       ${failed === 0 ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
      console.log(`========================================\n`);

      process.exitCode = failed === 0 ? 0 : 1;
    } catch (err) {
      console.error('Test execution error:', err);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runTests();
