module Mutations
	class MoveIssueLabel < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "MoveIssueLabel"
		argument :issue_label_id, ID, required: true, loads: IssueLabel
		argument :new_order, Int, required: true

		field :success, Boolean, null: false

		def resolve(issue_label:, new_order:)
			(raise GraphQL::ExecutionError.new "No label with that id") if issue_label.nil?



			issue_board = IssueBoard.joins(:issue_labels).where(issue_labels: {id: issue_label.id }).take;
			issue_labels_with_higher_order = issue_board.issue_labels.select { |label| label.order > issue_label.order && label.order <= new_order }

			if issue_labels_with_higher_order
				IssueLabel.transaction do
					issue_labels_with_higher_order.each do |label|
						label.order -= 1;
						label.save;
					end
				end
			end


			if issue_label.update(order: new_order);
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end
		
		def load_issue_label(id)
			IssueLabel.find(id)
		end

		private

		def authorized?(issue_label:, new_order:)
			issue_label_authorized?(issue_label, nil, context);
		end

	end
end