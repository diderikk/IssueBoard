group = Group.create(name: "Test_group")
users = User.create([{name: "Diderik", email: "diderikk@gmail.com", password: "hash123"}, {name: "Diderik", email: "did@gmail.com", password: "hash1234"}])
issue_board = IssueBoard.create(name: "TestBoard", group_id: 1)
issue_label = IssueLabel.create(name: "TestLabel", color: "TestColor", issue_board_id: 1)
issue = Issue.create(issue_id: 1, title: "TestTitle", description: nil, due_date: nil, issue_label_id: 1)
issue_board.issue_labels << issue_label

group.members.create(accepted: true, user: users[0])
