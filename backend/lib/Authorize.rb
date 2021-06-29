module Authorize
	def group_authorized?(group, group_id, context)
		unless group
			group = Group.find(group_id);
		end

		group.users.where(members: {accepted: true}).include? context[:current_user]
	end

	def issue_board_authorized?(issue_board_id, context)
		User.joins(groups: :issue_boards).where(issue_boards: { id: issue_board_id }, members: { accepted: true }).exists?(context[:current_user].id) ||
		User.joins(:issue_boards).where(issue_boards: { id: issue_board_id }).exists?(context[:current_user].id)
	end

	def issue_label_authorized?(issue_label, issue_label_id, context)
		unless issue_label
			issue_label = IssueLabel.find(issue_label_id);
		end

		issue_board_authorized?(issue_label.issue_board_id, context);
	end

	def issue_authorized?(issue_id, context)
		issue_board = IssueBoard.joins(issue_labels: :issues).where(issues: {id: issue_id }).take
		issue_board_authorized?(issue_board.id, context);
	end
end